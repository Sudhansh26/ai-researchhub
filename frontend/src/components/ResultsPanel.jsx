import './ResultsPanel.css'

const AGENT_COLORS = {
  'Web Researcher': 'var(--accent-cyan)',
  'YouTube Researcher': 'var(--accent-rose)',
  'Document Analyst': 'var(--accent-emerald)',
}

export default function ResultsPanel({ results, loading, error, activeAgents, agents }) {
  if (!loading && !results && !error) {
    return (
      <div className="results-panel glass-card empty-state">
        <div className="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
        </div>
        <h3>Ready to Research</h3>
        <p>Enter a question and click "Start Research" to activate the multi-agent system.<br />Each agent will investigate your query using specialized tools.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="results-panel glass-card loading-state">
        <div className="loading-header">
          <div className="spinner" style={{ width: 28, height: 28 }} />
          <div>
            <h3>Multi-Agent Research in Progress</h3>
            <p>Agents are investigating your query...</p>
          </div>
        </div>
        <div className="agent-progress">
          {agents
            .filter(agent => activeAgents.includes(agent.key))
            .map((agent, index) => (
              <div key={agent.key} className="progress-item fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <span className="progress-dot pulse" style={{ background: AGENT_COLORS[agent.name] || 'var(--accent-primary)' }} />
                <span className="progress-name">{agent.name}</span>
                <span className="progress-status">Searching...</span>
              </div>
            ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="results-panel glass-card error-state">
        <div className="error-icon">Warning</div>
        <h3>Research Failed</h3>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="results-panel">
      <div className="glass-card summary-card fade-in">
        <div className="summary-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <line x1="10" x2="8" y1="9" y2="9" />
          </svg>
          <h3>Research Summary</h3>
          <span className="badge badge-success">Complete</span>
        </div>
        <div className="summary-content">
          <FormattedText text={results.final_summary} />
        </div>
      </div>

      <div className="agent-results">
        <h4 className="section-title">Agent Reports</h4>
        {results.agent_results.map((agentResult, index) => (
          <div
            key={`${agentResult.agent_name}-${index}`}
            className="glass-card agent-result-card fade-in"
            style={{ animationDelay: `${(index + 1) * 0.15}s` }}
          >
            <div className="ar-header">
              <div className="ar-name" style={{ color: AGENT_COLORS[agentResult.agent_name] || 'var(--accent-primary)' }}>
                {agentResult.agent_name}
              </div>
              <span className={`badge ${agentResult.status === 'success' ? 'badge-success' : 'badge-error'}`}>
                {agentResult.status === 'success' ? 'Success' : 'Error'}
              </span>
            </div>
            <div className="ar-role">{agentResult.agent_role}</div>
            <div className="ar-content">
              <FormattedText text={agentResult.result} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Parse inline markdown (bold + links) into React elements.
 */
function parseInline(text) {
  // Split by **bold** and [label](url) patterns
  const parts = []
  const regex = /(\*\*(.+?)\*\*)|(\[([^\]]+)\]\((https?:\/\/[^)]+)\))/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    // Push plain text before this match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    if (match[1]) {
      // **bold**
      parts.push(<strong key={match.index}>{match[2]}</strong>)
    } else if (match[3]) {
      // [label](url) → clickable link
      parts.push(
        <a key={match.index} href={match[5]} target="_blank" rel="noopener noreferrer" className="inline-link">
          {match[4]}
        </a>
      )
    }
    lastIndex = match.index + match[0].length
  }

  // Remaining plain text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length ? parts : text
}

function FormattedText({ text }) {
  if (!text) return null

  const lines = text.split('\n')
  return (
    <div className="formatted-text">
      {lines.map((line, index) => {
        if (line.startsWith('## ')) return <h3 key={index}>{parseInline(line.slice(3))}</h3>
        if (line.startsWith('### ')) return <h4 key={index}>{parseInline(line.slice(4))}</h4>
        if (line.startsWith('---')) return <hr key={index} />
        if (line.startsWith('- ')) return <li key={index}>{parseInline(line.slice(2))}</li>
        if (line.trim() === '') return <br key={index} />
        return <p key={index}>{parseInline(line)}</p>
      })}
    </div>
  )
}
