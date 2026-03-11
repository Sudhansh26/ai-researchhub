# 🌐 AI ResearchHub — Multi-Agent Intelligence System

A **multi-agent AI research system** that uses specialized agents to investigate any topic from multiple angles — web search, YouTube videos, and uploaded documents — then synthesizes a unified research report.

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│         Orchestrator Agent          │
│  (Synthesizes all agent results)    │
├──────────┬──────────┬───────────────┤
│   Web    │ YouTube  │  Document     │
│Researcher│Researcher│  Analyst      │
│          │          │               │
│DuckDuckGo│ YouTube  │  ChromaDB     │
│Wikipedia │ Search   │  RAG Search   │
└──────────┴──────────┴───────────────┘
```

## 🚀 Quick Start

### 1. Get a Free HuggingFace API Key
- Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
- Create a free token
- Copy the `.env.example` to `.env` and paste your key:
```bash
cp .env.example .env
# Edit .env and add your HUGGINGFACE_API_KEY
```

### 2. Run Backend
```bash
cd ai_researcher
pip install -r requirements.txt

# Set your API key
set HUGGINGFACE_API_KEY=hf_your_key_here

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Run Frontend (React)
```bash
cd ai_researcher/frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

---

## 🐳 Deploy with Docker

```bash
cd ai_researcher

# Set your API key in .env file first
docker-compose up --build
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/agents` | List available agents |
| POST | `/research` | Run multi-agent research |
| POST | `/upload-pdf` | Upload & index a PDF |

### Example Research Request
```json
POST /research
{
  "question": "What are the latest advances in quantum computing?",
  "use_agents": ["web_researcher", "youtube_researcher"]
}
```

---

## 🤖 Agents

| Agent | Tools | Purpose |
|-------|-------|---------|
| **Web Researcher** | DuckDuckGo, Wikipedia | Current web info & facts |
| **YouTube Researcher** | YouTube Search | Educational videos |
| **Document Analyst** | ChromaDB RAG | Analysis of uploaded PDFs |

## Tech Stack
- **Backend**: FastAPI, LangChain, HuggingFace Inference API
- **Frontend**: React + Vite
- **Vector DB**: ChromaDB + sentence-transformers
- **Deploy**: Docker + docker-compose + Nginx
