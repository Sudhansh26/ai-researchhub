import './AgentCards.css'

const AGENT_ICONS = {
  web_researcher: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  ),
  youtube_researcher: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  ),
  document_analyst: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  ),
}

const AGENT_COLORS = {
  web_researcher: 'var(--accent-cyan)',
  youtube_researcher: 'var(--accent-rose)',
  document_analyst: 'var(--accent-emerald)',
}

export default function AgentCards({ agents, selectedAgents, activeAgents, onToggle }) {
  if (!agents.length) return null

  return (
    <div className="agent-cards glass-card">
      <div className="agent-cards-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <h3>Research Agents</h3>
        <span className="agent-count">{agents.length}</span>
      </div>
      <div className="agent-list">
        {agents.map((agent, i) => {
          const isSelected = !selectedAgents || selectedAgents.includes(agent.key)
          const isActive = activeAgents.includes(agent.key)
          return (
            <div
              key={agent.key}
              className={`agent-card ${isSelected ? 'selected' : 'deselected'} ${isActive ? 'active' : ''}`}
              onClick={() => onToggle(agent.key)}
              style={{ animationDelay: `${i * 0.1}s`, '--agent-color': AGENT_COLORS[agent.key] || 'var(--accent-primary)' }}
              id={`agent-card-${agent.key}`}
            >
              <div className="agent-icon" style={{ color: AGENT_COLORS[agent.key] }}>
                {AGENT_ICONS[agent.key] || 'AI'}
              </div>
              <div className="agent-info">
                <span className="agent-name">{agent.name}</span>
                <span className="agent-role">{agent.role}</span>
                <div className="agent-tools">
                  {agent.tools.map(tool => (
                    <span key={tool} className="tool-tag">{tool}</span>
                  ))}
                </div>
              </div>
              <div className="agent-status-indicator">
                {isActive ? (
                  <span className="badge badge-working">
                    <span className="spinner" style={{ width: 10, height: 10 }} />
                    Working
                  </span>
                ) : (
                  <div className={`toggle-dot ${isSelected ? 'on' : 'off'}`} />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
