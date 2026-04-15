# AI Resume Analyzer & ATS Scorer 🚀

A modern, AI-powered tool built for analyzing resumes against job descriptions to provide ATS scores, keyword gaps, and improvement tips.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Python (FastAPI), PyPDF2, OpenAI SDK (connected to NVIDIA NIM).
- **AI Model**: `minimaxai/minimax-m2.5` (via NVIDIA AI Foundation).

## Project Structure

- `/frontend`: React application (Vite).
- `/backend`: FastAPI server and PDF parsing logic.

## Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- An API Key from [NVIDIA Build](https://build.nvidia.com) (or any OpenAI-compatible provider).

### 2. Backend Setup
Create a `.env` file in the `/backend` directory:
```env
NVIDIA_API_KEY=your_nvidia_api_key_here
```

### 3. Installation
From the **root** directory, run:
```bash
# Install root orchestration tools
npm install

# Install all dependencies (Frontend + Backend)
npm run install:all
```

### 4. Running the Project
To launch **both** the frontend and backend simultaneously:
```bash
npm run dev
```

The application will be available at:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:8000](http://localhost:8000) (Swagger UI at `/docs`)

## Key Features
- **PDF Extraction**: Automatically extracts text from uploaded PDF resumes.
- **ATS Match Score**: Visual circular progress bar showing compatibility.
- **Keyword Analysis**: Identifies missing skills and keywords based on the JD.
- **Glassmorphism UI**: Premium, tech-focused design with smooth animations.
