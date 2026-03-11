import { useState, useEffect } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import AgentCards from './components/AgentCards'
import ResultsPanel from './components/ResultsPanel'
import PdfUpload from './components/PdfUpload'
import StatusBar from './components/StatusBar'
import { runResearch, getAgents, healthCheck } from './api'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [agents, setAgents] = useState([])
  const [selectedAgents, setSelectedAgents] = useState(null)
  const [backendStatus, setBackendStatus] = useState('checking')
  const [activeAgents, setActiveAgents] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    checkBackend()
  }, [])

  async function checkBackend() {
    try {
      await healthCheck()
      setBackendStatus('online')
      const data = await getAgents()
      setAgents(data.agents || [])
    } catch {
      setBackendStatus('offline')
    }
  }

  async function handleResearch() {
    if (!query.trim() || loading) return
    setLoading(true)
    setError(null)
    setResults(null)

    const agentKeys = selectedAgents || agents.map(agent => agent.key)
    setActiveAgents(agentKeys)

    try {
      const data = await runResearch(query, selectedAgents)
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setActiveAgents([])
    }
  }

  function toggleAgent(key) {
    setSelectedAgents(prev => {
      if (!prev) {
        const all = agents.map(agent => agent.key).filter(agentKey => agentKey !== key)
        return all.length ? all : null
      }
      if (prev.includes(key)) {
        const next = prev.filter(agentKey => agentKey !== key)
        return next.length ? next : null
      }
      return [...prev, key]
    })
  }

  return (
    <>
      <div className="animated-bg" />
      <div className="app-container">
        <Header />
        <StatusBar status={backendStatus} onRetry={checkBackend} />

        <main className="main-content">
          <div className="left-panel">
            <SearchBar
              query={query}
              setQuery={setQuery}
              onSearch={handleResearch}
              loading={loading}
              disabled={backendStatus !== 'online'}
            />
            <AgentCards
              agents={agents}
              selectedAgents={selectedAgents}
              activeAgents={activeAgents}
              onToggle={toggleAgent}
            />
            <PdfUpload disabled={backendStatus !== 'online'} />
          </div>

          <div className="right-panel">
            <ResultsPanel
              results={results}
              loading={loading}
              error={error}
              activeAgents={activeAgents}
              agents={agents}
            />
          </div>
        </main>
      </div>
    </>
  )
}

export default App
