import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState('')
  let recognition = null

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.')
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [recognition])

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition = new SpeechRecognition()
    
    recognition.continuous = true
    recognition.interimResults = true
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      setTranscript(transcript)
    }

    recognition.onerror = (event) => {
      setError('Error occurred in recognition: ' + event.error)
    }

    recognition.start()
    setIsListening(true)
    setError('')
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
    }
    setIsListening(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript)
  }

  const clearTranscript = () => {
    setTranscript('')
  }

  return (
    <div className="speech-container">
      <div className="speech-header">
        <h1>Speech to Text</h1>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="controls">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`record-button ${isListening ? 'recording' : ''}`}
        >
          {isListening ? '⬛ Stop' : '⚫ Start Recording'}
        </button>
      </div>

      <div className="transcript">
        {transcript || <span className="transcript-empty">Start speaking...</span>}
      </div>

      <div className="button-group">
        <button
          onClick={clearTranscript}
          className="action-button"
          disabled={!transcript}
        >
          Clear
        </button>
        <button
          onClick={copyToClipboard}
          className="action-button"
          disabled={!transcript}
        >
          Copy
        </button>
      </div>

      {isListening && (
        <div className="status">Listening...</div>
      )}
    </div>
  )
}

export default App