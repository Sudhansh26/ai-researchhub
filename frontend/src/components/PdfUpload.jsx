import { useState, useRef } from 'react'
import { uploadPDF } from '../api'
import './PdfUpload.css'

export default function PdfUpload({ disabled }) {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  async function handleFile(file) {
    if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file')
      return
    }

    setUploading(true)
    setError(null)
    setResult(null)
    try {
      const data = await uploadPDF(file)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  return (
    <div className="pdf-upload glass-card">
      <div className="pdf-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
        <h3>Upload PDF</h3>
      </div>

      <div
        className={`drop-zone ${dragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && fileRef.current?.click()}
        onDragOver={e => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        id="pdf-drop-zone"
      >
        {uploading ? (
          <div className="upload-progress">
            <span className="spinner" />
            <span>Indexing document...</span>
          </div>
        ) : (
          <>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            </svg>
            <p>Drop PDF here or click to browse</p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])}
          id="pdf-file-input"
        />
      </div>

      {result && (
        <div className="upload-result fade-in">
          <span className="badge badge-success">Indexed</span>
          <span className="upload-info">{result.filename} - {result.chunks_created} chunks</span>
        </div>
      )}
      {error && (
        <div className="upload-error fade-in">
          <span className="badge badge-error">Error</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
