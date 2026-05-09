import { useState, useRef } from 'react'

const EXAMPLES = [
  "No cap, ese outfit está lowkey fire fr fr 💀",
  "Bro, eso es un red flag enorme, major ick 🚩",
  "Está muy slay, literal bestie goals ✨",
  "No te pongas así, it's giving drama, periodt 💅",
  "Ese wey es mid, ni fu ni fa, ngl 😐",
]

export default function App() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const textareaRef = useRef(null)
  const outputRef = useRef(null)

  const MAX_CHARS = 500

  async function translate() {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    setOutput('')

    setTimeout(() => {
      outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `Eres un traductor experto de español Gen Z al español normal y adulto. 
Tu trabajo es tomar texto escrito en el estilo Gen Z en español (con términos como "no cap", "lowkey", "slay", "fr fr", "ngl", "mid", "ick", "red flag", "bestie", "periodt", "it's giving", "literally", "vibes", etc.) y traducirlo a un español claro, formal y completamente comprensible para cualquier adulto hispanohablante.

Reglas:
- Elimina todos los anglicismos Gen Z y reemplázalos con equivalentes en español claro
- Mantén el significado y la emoción original
- No uses jerga ni coloquialismos complejos
- El resultado debe sonar natural en español
- Responde SOLO con la traducción, sin explicaciones, sin comillas, sin prefijos como "Traducción:" 
- Si el texto ya está en español normal, solo devuélvelo limpio
- Elimina los emojis excesivos pero puedes dejar alguno relevante si es necesario`,
          messages: [{ role: 'user', content: input }],
        }),
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error.message)
      const text = data.content?.map(b => b.text || '').join('') || ''
      setOutput(text)
    } catch (err) {
      setError('Algo salió mal. Inténtalo de nuevo 😬')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleInput(e) {
    const val = e.target.value
    if (val.length <= MAX_CHARS) {
      setInput(val)
      setCharCount(val.length)
    }
  }

  function loadExample() {
    const ex = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)]
    setInput(ex)
    setCharCount(ex.length)
    setOutput('')
    setError('')
  }

  function copyOutput() {
    if (!output) return
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function clear() {
    setInput('')
    setOutput('')
    setCharCount(0)
    setError('')
    textareaRef.current?.focus()
  }

  return (
    <div className="page">
      <header className="header">
        <div className="header-inner">
          <div className="badge">BETA 💀</div>
          <h1 className="title">Renatito<br />Translates</h1>
          <p className="subtitle">De "no cap fr fr lowkey slay"<br />a español de verdad</p>
        </div>
        <div className="ticker">
          <div className="ticker-inner">
            {[...EXAMPLES, ...EXAMPLES].map((ex, i) => (
              <span key={i} className="ticker-item">{ex} &nbsp;—&nbsp; </span>
            ))}
          </div>
        </div>
      </header>

      <main className="main">
        <div className="panel">
          <div className="panel-header">
            <span className="panel-label label-yellow">GEN Z 🧢</span>
            <div className="panel-actions">
              <button className="ghost-btn" onClick={loadExample}>ejemplo</button>
              <button className="ghost-btn" onClick={clear}>limpiar</button>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            className="textarea"
            value={input}
            onChange={handleInput}
            placeholder={"Escribe aquí en Gen Z...\n\n\"No cap, esto está muy lowkey fire fr fr 💀\""}
            spellCheck={false}
          />
          <div className="panel-footer">
            <span className="char-count">{charCount}/{MAX_CHARS}</span>
            <button
              className={`translate-btn${loading || !input.trim() ? ' disabled' : ''}`}
              onClick={translate}
              disabled={loading || !input.trim()}
            >
              {loading ? 'traduciendo...' : 'TRADUCIR →'}
            </button>
          </div>
        </div>

        <div className="divider-row">
          <div className="divider-line" />
          <div className="divider-icon">{loading ? '⏳' : '⚡'}</div>
          <div className="divider-line" />
        </div>

        <div className="panel" ref={outputRef}>
          <div className="panel-header">
            <span className="panel-label label-green">ESPAÑOL NORMAL ✅</span>
            {output && (
              <button className="ghost-btn" onClick={copyOutput}>
                {copied ? '¡copiado! ✓' : 'copiar'}
              </button>
            )}
          </div>
          <div className="output-box">
            {error ? (
              <p className="error-text">{error}</p>
            ) : loading ? (
              <div className="loading-dots">
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </div>
            ) : output ? (
              <p className="output-text">{output}</p>
            ) : (
              <p className="placeholder-text">La traducción aparecerá aquí...</p>
            )}
          </div>
          {output && (
            <div className="panel-footer">
              <span className="char-count">{output.length} caracteres</span>
              <span className="powered">powered by Claude AI</span>
            </div>
          )}
        </div>

        <div className="dict">
          <p className="dict-title">MINI DICCIONARIO GEN Z →</p>
          <div className="dict-grid">
            {[
              ['no cap', 'en serio'],
              ['lowkey', 'a escondidas / un poco'],
              ['slay', 'lo está rompiendo'],
              ['fr fr', 'de verdad'],
              ['mid', 'mediocre'],
              ['ick', 'algo que da asco'],
              ['red flag', 'señal de alarma'],
              ["it's giving", 'tiene vibras de'],
              ['periodt', 'punto final'],
              ['ngl', 'siendo honesto/a'],
              ['bestie', 'mejor amig@'],
              ['vibe check', 'verificar el ambiente'],
            ].map(([genz, normal]) => (
              <div key={genz} className="dict-item">
                <span className="dict-genz">{genz}</span>
                <span className="dict-arrow">→</span>
                <span className="dict-normal">{normal}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Hecho con 💀 y Claude AI · No cap, te va a ayudar con tus abuel@s</p>
      </footer>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Space Mono', monospace;
          background: #f5f0e8;
          color: #0a0a0a;
          -webkit-text-size-adjust: 100%;
          min-height: 100vh;
        }

        .page { min-height: 100vh; display: flex; flex-direction: column; }

        .header { background: #0a0a0a; color: #f5f0e8; overflow: hidden; }
        .header-inner { padding: 20px 16px 16px; }
        .badge {
          display: inline-block;
          background: #ffe135; color: #0a0a0a;
          font-weight: 700; font-size: 10px;
          padding: 3px 8px; margin-bottom: 8px; letter-spacing: 2px;
        }
        .title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(42px, 16vw, 96px);
          font-weight: 800; line-height: 0.9;
          color: #f5f0e8; letter-spacing: -2px; margin-bottom: 10px;
        }
        .subtitle { font-size: 12px; color: #ffe135; line-height: 1.6; }

        .ticker { border-top: 2px solid #2a2a2a; padding: 9px 0; overflow: hidden; white-space: nowrap; }
        .ticker-inner { display: inline-block; animation: ticker 25s linear infinite; }
        .ticker-item { font-size: 11px; color: #555; }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .main {
          flex: 1; padding: 14px 14px 0;
          display: flex; flex-direction: column;
          max-width: 800px; margin: 0 auto; width: 100%;
        }

        .panel { background: #fff; border: 3px solid #0a0a0a; display: flex; flex-direction: column; }

        .panel-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 12px; border-bottom: 3px solid #0a0a0a;
          background: #fafafa; gap: 8px; flex-wrap: wrap;
        }
        .panel-label {
          font-weight: 700; font-size: 10px; letter-spacing: 1.5px;
          padding: 4px 8px; border: 2px solid #0a0a0a;
        }
        .label-yellow { background: #ffe135; }
        .label-green { background: #00e676; }

        .panel-actions { display: flex; gap: 6px; }
        .ghost-btn {
          font-family: 'Space Mono', monospace; font-size: 11px;
          background: transparent; border: 1.5px solid #ccc;
          padding: 8px 12px; cursor: pointer; color: #555;
          min-height: 38px; -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .ghost-btn:active { background: #efefef; }

        .textarea {
          border: none; outline: none; padding: 14px;
          font-family: 'Space Mono', monospace;
          font-size: 16px; /* prevents iOS zoom */
          line-height: 1.7; resize: none;
          background: transparent; color: #0a0a0a;
          min-height: 150px; width: 100%;
        }

        .panel-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 12px; border-top: 2px solid #eee; background: #fafafa; gap: 8px;
        }
        .char-count { font-size: 11px; opacity: 0.5; flex-shrink: 0; }
        .powered { font-size: 11px; opacity: 0.4; }

        .translate-btn {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 13px; letter-spacing: 1px;
          background: #0a0a0a; color: #ffe135;
          border: 2px solid #0a0a0a; padding: 12px 18px;
          cursor: pointer; box-shadow: 3px 3px 0 #ffe135;
          min-height: 44px; white-space: nowrap;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
        }
        .translate-btn.disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        .translate-btn:not(.disabled):active { transform: translate(2px,2px); box-shadow: 1px 1px 0 #ffe135; }

        .divider-row {
          display: flex; align-items: center;
          padding: 0 16px; height: 44px;
        }
        .divider-line { flex: 1; height: 3px; background: #0a0a0a; }
        .divider-icon {
          width: 38px; height: 38px;
          background: #ffe135; border: 3px solid #0a0a0a;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px; flex-shrink: 0;
        }

        .output-box {
          flex: 1; padding: 14px; min-height: 100px;
          display: flex; align-items: flex-start;
        }
        .output-text { font-size: 15px; line-height: 1.7; }
        .placeholder-text { font-size: 14px; color: #bbb; font-style: italic; }
        .error-text { font-size: 14px; color: #ff3c6f; }
        .loading-dots { font-size: 30px; display: flex; gap: 2px; }
        .dot:nth-child(1) { animation: blink 1.4s infinite 0s; }
        .dot:nth-child(2) { animation: blink 1.4s infinite 0.2s; }
        .dot:nth-child(3) { animation: blink 1.4s infinite 0.4s; }
        @keyframes blink {
          0%, 20% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }

        .dict {
          margin-top: 16px; margin-bottom: 16px;
          border: 3px solid #0a0a0a; box-shadow: 5px 5px 0 #0a0a0a;
          background: #fff; padding: 16px;
        }
        .dict-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 11px; letter-spacing: 2px; margin-bottom: 12px; }
        .dict-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
        .dict-item {
          display: flex; align-items: center; gap: 5px;
          padding: 7px 9px; border: 1.5px solid #e0e0e0; background: #fafafa; min-width: 0;
        }
        .dict-genz { font-weight: 700; font-size: 11px; color: #1a1aff; flex-shrink: 0; }
        .dict-arrow { font-size: 11px; color: #999; flex-shrink: 0; }
        .dict-normal { font-size: 10px; color: #555; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .footer {
          border-top: 3px solid #0a0a0a; padding: 14px 16px;
          background: #0a0a0a; color: #555; font-size: 11px; text-align: center;
        }

        @media (min-width: 600px) {
          .header-inner { padding: 32px 36px 24px; }
          .subtitle { font-size: 14px; }
          .main { padding: 28px 36px 0; }
          .textarea { font-size: 14px; min-height: 200px; }
          .panel-header { padding: 10px 16px; }
          .panel-footer { padding: 10px 16px; }
          .ghost-btn { padding: 5px 12px; min-height: auto; }
          .dict { box-shadow: 8px 8px 0 #0a0a0a; padding: 20px; margin-top: 24px; margin-bottom: 24px; }
          .dict-grid { grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); }
          .dict-normal { white-space: normal; overflow: visible; text-overflow: unset; }
        }
      `}</style>
    </div>
  )
}
