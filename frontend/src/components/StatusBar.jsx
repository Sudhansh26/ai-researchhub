import './StatusBar.css'

export default function StatusBar({ status, onRetry }) {
  return (
    <div className={`status-bar ${status}`}>
      <div className="status-dot" />
      <span className="status-text">
        {status === 'checking' && 'Connecting to backend...'}
        {status === 'online' && 'Backend connected - All systems operational'}
        {status === 'offline' && 'Backend offline - Start the server to begin'}
      </span>
      {status === 'offline' && (
        <button className="btn-secondary status-retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}
