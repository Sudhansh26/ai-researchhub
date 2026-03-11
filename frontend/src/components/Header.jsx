import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <div className="logo-text">
            <h1>AI Research<span className="accent">Hub</span></h1>
            <p className="subtitle">Multi-Agent Intelligence System</p>
          </div>
        </div>
      </div>
      <div className="header-right">
        <span className="version-badge">v1.0</span>
        <span className="badge badge-info">Multi-Agent</span>
      </div>
    </header>
  )
}
