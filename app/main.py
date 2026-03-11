import shutil
import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.agent.agent import run_all_agents, get_available_agents
from app.rag.ingest import ingest_pdf
from app.schemas.request import ResearchRequest, ResearchResponse, AgentResult, UploadResponse
from app.config import UPLOADS_DIR

app = FastAPI(
    title="AI Multi-Agent Research System",
    description="A multi-agent AI research system with specialized agents for web, YouTube, and document analysis.",
    version="1.0.0",
)

# ─── CORS (allow React frontend) ───
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    """Health check endpoint."""
    return {
        "message": "AI Multi-Agent Research System Running",
        "version": "1.0.0",
        "agents": len(get_available_agents()),
    }


@app.get("/agents")
def list_agents():
    """List all available research agents."""
    return {"agents": get_available_agents()}


@app.post("/research", response_model=ResearchResponse)
async def research(request: ResearchRequest):
    """
    Run multi-agent research on a question.
    
    The orchestrator dispatches the question to specialized agents,
    collects their results, and synthesizes a unified report.
    """
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    result = run_all_agents(
        question=request.question,
        agent_keys=request.use_agents,
    )

    return ResearchResponse(
        question=result["question"],
        agent_results=[AgentResult(**ar) for ar in result["agent_results"]],
        final_summary=result["final_summary"],
    )


@app.post("/upload-pdf", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    """Upload and index a PDF document for the Document Analyst agent."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    path = os.path.join(UPLOADS_DIR, file.filename)

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    chunks = ingest_pdf(path)

    return UploadResponse(
        message="PDF successfully indexed",
        filename=file.filename,
        chunks_created=chunks,
    )