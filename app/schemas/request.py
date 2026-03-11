from pydantic import BaseModel
from typing import Optional, List


class ResearchRequest(BaseModel):
    """Request body for the /research endpoint."""
    question: str
    use_agents: Optional[List[str]] = None  # None = use all agents


class AgentResult(BaseModel):
    """Result from a single agent."""
    agent_name: str
    agent_role: str
    result: str
    status: str  # "success" or "error"


class ResearchResponse(BaseModel):
    """Response from the /research endpoint."""
    question: str
    agent_results: List[AgentResult]
    final_summary: str


class UploadResponse(BaseModel):
    """Response from the /upload-pdf endpoint."""
    message: str
    filename: str
    chunks_created: int
