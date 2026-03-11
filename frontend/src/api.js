const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Run multi-agent research on a question.
 */
export async function runResearch(question, useAgents = null) {
  const body = { question };
  if (useAgents) body.use_agents = useAgents;

  const response = await fetch(`${API_BASE}/research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Research failed (${response.status})`);
  }

  return response.json();
}

/**
 * Upload a PDF document for indexing.
 */
export async function uploadPDF(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload-pdf`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Upload failed (${response.status})`);
  }

  return response.json();
}

/**
 * Get list of available agents.
 */
export async function getAgents() {
  const response = await fetch(`${API_BASE}/agents`);
  if (!response.ok) throw new Error('Failed to fetch agents');
  return response.json();
}

/**
 * Health check.
 */
export async function healthCheck() {
  const response = await fetch(`${API_BASE}/`);
  if (!response.ok) throw new Error('Backend not reachable');
  return response.json();
}
