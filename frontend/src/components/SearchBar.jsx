import './SearchBar.css'

export default function SearchBar({ query, setQuery, onSearch, loading, disabled }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSearch()
    }
  }

  return (
    <div className="search-bar glass-card">
      <div className="search-header">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <h3>Research Query</h3>
      </div>
      <div className="search-input-wrapper">
        <textarea
          className="search-input input-field"
          placeholder="What would you like to research? e.g., 'Latest advances in quantum computing'"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          disabled={disabled || loading}
          id="research-query-input"
        />
        <button
          className="btn-primary search-btn"
          onClick={onSearch}
          disabled={!query.trim() || loading || disabled}
          id="search-button"
        >
          {loading ? (
            <span className="btn-loading">
              <span className="spinner" />
              Researching...
            </span>
          ) : (
            <span className="btn-content">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
              Start Research
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
