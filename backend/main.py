import io
import json
import os
import re
from hashlib import sha256
from typing import Any

import httpx
import PyPDF2
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

load_dotenv()

NVIDIA_BASE_URL = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "")
NVIDIA_MODEL = os.getenv("NVIDIA_MODEL", "minimaxai/minimax-m2.5")

if not NVIDIA_API_KEY:
    print("WARNING: NVIDIA_API_KEY is not configured. Update backend/.env before running analysis.")

# Use a custom HTTP client with timeout for faster connections
timeout_client = httpx.Client(timeout=httpx.Timeout(30.0, connect=5.0))
client = OpenAI(
    base_url=NVIDIA_BASE_URL,
    api_key=NVIDIA_API_KEY,
    http_client=timeout_client
)

# Alternative faster model options
FAST_MODEL = os.getenv("FAST_MODEL", "meta/llama-3.1-8b-instruct")  # Faster, cheaper model for quick analysis
analysis_cache: dict[str, dict[str, Any]] = {}

app = FastAPI(title="AI Resume Analyzer API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Error parsing PDF: {exc}") from exc

    extracted_pages = []
    for page in pdf_reader.pages:
        page_text = page.extract_text()
        if page_text:
            extracted_pages.append(page_text.strip())

    return "\n\n".join(extracted_pages).strip()


def normalize_text_list(value: Any) -> list[str]:
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]
    return []


def normalize_whitespace(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def dedupe_preserve_order(items: list[str]) -> list[str]:
    seen: set[str] = set()
    unique_items: list[str] = []
    for item in items:
        normalized = normalize_whitespace(item).strip(" -*\t")
        if not normalized:
            continue
        key = normalized.lower()
        if key in seen:
            continue
        seen.add(key)
        unique_items.append(normalized)
    return unique_items


def trim_text(text: str, max_chars: int) -> str:
    normalized = normalize_whitespace(text)
    if len(normalized) <= max_chars:
        return normalized
    return normalized[: max_chars - 3].rstrip() + "..."


def build_cache_key(resume_text: str, job_description: str) -> str:
    cache_input = f"{resume_text}\n---\n{job_description}".encode("utf-8", errors="ignore")
    return sha256(cache_input).hexdigest()


def extract_message_text(message_content: Any) -> str:
    if isinstance(message_content, str):
        return message_content.strip()

    if isinstance(message_content, list):
        text_parts: list[str] = []
        for part in message_content:
            if isinstance(part, str):
                cleaned_part = part.strip()
                if cleaned_part:
                    text_parts.append(cleaned_part)
                continue

            if isinstance(part, dict):
                possible_text = part.get("text")
                if isinstance(possible_text, str) and possible_text.strip():
                    text_parts.append(possible_text.strip())
                    continue

                nested_text = part.get("content")
                if isinstance(nested_text, str) and nested_text.strip():
                    text_parts.append(nested_text.strip())
                continue

            possible_text = getattr(part, "text", None)
            if isinstance(possible_text, str) and possible_text.strip():
                text_parts.append(possible_text.strip())
                continue

            nested_text = getattr(part, "content", None)
            if isinstance(nested_text, str) and nested_text.strip():
                text_parts.append(nested_text.strip())

        return "\n".join(text_parts).strip()

    return str(message_content or "").strip()


def split_sentences(text: str) -> list[str]:
    normalized = normalize_whitespace(text)
    if not normalized:
        return []
    return [segment.strip() for segment in re.split(r"(?<=[.!?])\s+", normalized) if segment.strip()]


def extract_list_from_section(raw_text: str, section_names: list[str]) -> list[str]:
    escaped_names = "|".join(re.escape(name) for name in section_names)
    
    # Try to find JSON array format first: "key":["item1","item2"]
    json_array_pattern = rf'(?is)["\']?(?:{escaped_names})["\']?\s*:\s*\[(.*?)\]'
    json_match = re.search(json_array_pattern, raw_text)
    if json_match:
        array_content = json_match.group(1)
        # Extract quoted strings from array
        items = re.findall(r'["\']([^"\']+)["\']', array_content)
        if items:
            return dedupe_preserve_order([item.strip() for item in items if item.strip()])
    
    # Fallback to text-based section extraction
    section_pattern = rf"(?is)(?:^|\n)\s*(?:{escaped_names})\s*:?\s*(.+?)(?=\n\s*[A-Za-z][A-Za-z _-]{{2,}}:|\Z)"
    match = re.search(section_pattern, raw_text)
    if not match:
        return []

    section_body = match.group(1)
    bullet_items: list[str] = []
    for line in section_body.splitlines():
        cleaned_line = re.sub(r"^\s*(?:[-*]|\d+[.)])\s*", "", line).strip()
        if cleaned_line:
            bullet_items.append(cleaned_line)

    if bullet_items:
        return dedupe_preserve_order(bullet_items)

    comma_separated = [part.strip() for part in section_body.split(",") if part.strip()]
    return dedupe_preserve_order(comma_separated)


def build_fallback_analysis(raw_text: str) -> dict[str, Any]:
    normalized_text = raw_text.strip()
    
    # Try to extract ATS score
    score_match = re.search(r"(?i)ats[_ ]?score[^0-9]{0,20}(\d{1,3})", normalized_text)
    if score_match:
        ats_score = max(0, min(100, int(score_match.group(1))))
    else:
        # Try to find any number that looks like a score (0-100)
        score_match = re.search(r'(?i)["\']?ats_score["\']?\s*:\s*(\d+)', normalized_text)
        if score_match:
            ats_score = max(0, min(100, int(score_match.group(1))))
        else:
            ats_score = 0

    # Try to extract summary - first try JSON format
    summary = ""
    json_summary_match = re.search(r'(?is)["\']?summary["\']?\s*:\s*["\']([^"\']+)["\']', normalized_text)
    if json_summary_match:
        summary = normalize_whitespace(json_summary_match.group(1))
    else:
        # Try text format
        summary_match = re.search(r"(?is)summary\s*:?\s*(.+?)(?=\n\s*[A-Za-z][A-Za-z _-]{2,}:|\Z)", normalized_text)
        if summary_match:
            summary = normalize_whitespace(summary_match.group(1))
        else:
            sentences = split_sentences(normalized_text)
            if sentences:
                summary = " ".join(sentences[:2])

    if not summary:
        summary = "The resume was analyzed, but the model did not return a usable summary."

    strengths = extract_list_from_section(normalized_text, ["strengths", "strengths identified"])
    missing_keywords = extract_list_from_section(
        normalized_text,
        ["missing keywords", "keyword gaps", "keyword analysis"],
    )
    improvement_tips = extract_list_from_section(
        normalized_text,
        ["improvement tips", "recommendations", "neural recommendations"],
    )

    if not strengths:
        strengths = dedupe_preserve_order(
            [sentence for sentence in split_sentences(normalized_text) if len(sentence) <= 140][:3]
        )

    if not improvement_tips:
        improvement_tips = [
            "Align your resume wording more closely with the job description.",
            "Highlight measurable impact in recent roles and projects.",
            "Add any missing tools, skills, or certifications that genuinely apply.",
        ]

    return {
        "ats_score": ats_score,
        "summary": summary,
        "strengths": strengths[:5],
        "missing_keywords": missing_keywords[:6],
        "improvement_tips": improvement_tips[:5],
    }


def clean_model_json(raw_text: str) -> dict[str, Any]:
    text = raw_text.strip()
    
    # Remove markdown code fences if present
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
        text = text.strip()

    # Try to find JSON object - look for outermost braces
    # Use a more careful approach to find balanced braces
    start_idx = text.find('{')
    if start_idx == -1:
        # No JSON object found, use fallback
        return build_fallback_analysis(raw_text)
    
    # Find the matching closing brace
    brace_count = 0
    end_idx = start_idx
    for i, char in enumerate(text[start_idx:]):
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
            if brace_count == 0:
                end_idx = start_idx + i + 1
                break
    
    cleaned = text[start_idx:end_idx]

    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError:
        # Try to fix common JSON issues
        try:
            # Remove trailing commas before closing braces/brackets
            cleaned = re.sub(r",(\s*[}\]])", r"\1", cleaned)
            # Try parsing again
            parsed = json.loads(cleaned)
        except json.JSONDecodeError:
            print("-" * 50)
            print("DEBUG: AI returned invalid JSON. Falling back to best-effort parsing.")
            print("RAW RESPONSE:")
            print(raw_text[:500])
            print("-" * 50)
            return build_fallback_analysis(raw_text)

    if not isinstance(parsed, dict):
        return build_fallback_analysis(raw_text)

    ats_score = parsed.get("ats_score", 0)
    try:
        ats_score = max(0, min(100, int(ats_score)))
    except (TypeError, ValueError):
        ats_score = 0

    summary = str(parsed.get("summary", "")).strip()
    if not summary:
        summary = "The resume was analyzed, but the model did not return a usable summary."

    return {
        "ats_score": ats_score,
        "summary": summary,
        "strengths": normalize_text_list(parsed.get("strengths")),
        "missing_keywords": normalize_text_list(parsed.get("missing_keywords")),
        "improvement_tips": normalize_text_list(parsed.get("improvement_tips")),
    }


def build_analysis_prompt(resume_text: str, job_description: str) -> str:
    return f"""Analyze resume for ATS compatibility. Return ONLY JSON.

Resume:
{resume_text}

Job Description:
{job_description}

Respond with JSON only:
{{"ats_score":0-100,"summary":"2 sentences max","strengths":["3-5 items"],"missing_keywords":["3-6 items"],"improvement_tips":["3-5 items"]}}
""".strip()


def analyze_with_model(resume_text: str, job_description: str) -> dict[str, Any]:
    if not NVIDIA_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Backend AI key is missing. Set NVIDIA_API_KEY in backend/.env.",
        )

    # More aggressive trimming for faster processing
    trimmed_resume = trim_text(resume_text, 4000)  # Reduced from 6000
    trimmed_job_description = trim_text(job_description, 2000)  # Reduced from 3500
    cache_key = build_cache_key(trimmed_resume, trimmed_job_description)

    cached_result = analysis_cache.get(cache_key)
    if cached_result:
        return cached_result

    prompt = build_analysis_prompt(trimmed_resume, trimmed_job_description)
    
    # Try fast model first for speed
    models_to_try = [FAST_MODEL, NVIDIA_MODEL]
    last_error = None
    
    for model in models_to_try:
        request_kwargs = {
            "model": model,
            "messages": [
                {
                    "role": "system",
                    "content": "Return JSON only. No extra text.",
                },
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.1,  # Lower temp for faster, more deterministic output
            "top_p": 0.95,
            "max_tokens": 400,  # Reduced from 700 - we don't need that many tokens
        }

        try:
            completion = client.chat.completions.create(
                **request_kwargs,
                response_format={"type": "json_object"},
            )
            
            message = extract_message_text(completion.choices[0].message.content) if completion.choices else ""
            if message:
                cleaned_response = clean_model_json(message)
                analysis_cache[cache_key] = cleaned_response
                return cleaned_response
                
        except Exception as exc:
            last_error = exc
            error_message = str(exc).lower()
            
            # If json_object not supported, try without it
            if "response_format" in error_message or "json_object" in error_message:
                try:
                    completion = client.chat.completions.create(**request_kwargs)
                    message = extract_message_text(completion.choices[0].message.content) if completion.choices else ""
                    if message:
                        cleaned_response = clean_model_json(message)
                        analysis_cache[cache_key] = cleaned_response
                        return cleaned_response
                except Exception:
                    pass  # Try next model
            
            # Continue to next model if this one failed
            continue
    
    # All models failed
    raise HTTPException(status_code=502, detail=f"Model request failed: {last_error}")


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "AI Resume Analyzer backend is running."}


@app.get("/health")
async def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "model": NVIDIA_MODEL,
        "providerConfigured": bool(NVIDIA_API_KEY),
    }


@app.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...),
) -> dict[str, Any]:
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF resume files are supported.")

    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description is required.")

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded PDF is empty.")

    resume_text = extract_text_from_pdf(file_bytes)
    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from the PDF. The file may be scanned or empty.",
        )

    return analyze_with_model(resume_text=resume_text, job_description=job_description.strip())


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
