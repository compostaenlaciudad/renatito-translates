import { useState, useRef } from 'react'

const EXAMPLES = [
  "No cap, ese outfit está lowkey fire fr fr 💀",
  "Bro, eso es un red flag enorme, major ick 🚩",
  "Está muy slay, literal bestie goals ✨",
  "No te pongas así, it's giving drama, periodt 💅",
  "Ese wey es mid, ni fu ni fa, ngl 😐",
]

const EMOJIS = ['💀', '✨', '🔥', '😤', '💅', '🫶', '🧢', '👀', '🫠']

function randomEmoji() {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
}

export default function App() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const textareaRef = useRef(null)

  const MAX_CHARS = 500

  async function translate() {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    setOutput('')

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
          messages: [
            { role: 'user', content: input }
          ],
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
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.badge}>BETA 💀</div>
          <h1 style={styles.title}>GenZ<br />Traductor</h1>
          <p style={styles.subtitle}>
            De "no cap fr fr lowkey slay" a español de verdad
          </p>
        </div>
        <div style={styles.ticker}>
          <div style={styles.tickerInner}>
            {[...EXAMPLES, ...EXAMPLES].map((ex, i) => (
              <span key={i} style={styles.tickerItem}>{ex} &nbsp;&nbsp;—&nbsp;&nbsp;</span>
            ))}
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={styles.main}>
        <div style={styles.grid}>
          {/* Input panel */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <span style={{ ...styles.panelLabel, background: '#ffe135' }}>
                GEN Z 🧢
              </span>
              <div style={styles.panelActions}>
                <button style={styles.ghostBtn} onClick={loadExample}>
                  ejemplo aleatorio
                </button>
                <button style={styles.ghostBtn} onClick={clear}>
                  limpiar
                </button>
              </div>
            </div>
            <textarea
              ref={textareaRef}
              style={styles.textarea}
              value={input}
              onChange={handleInput}
              placeholder={"Escribe aquí en Gen Z...\n\n\"No cap, esto está muy lowkey fire fr fr 💀\""}
              spellCheck={false}
            />
            <div style={styles.panelFooter}>
              <span style={{ fontSize: '12px', opacity: 0.5 }}>
                {charCount}/{MAX_CHARS}
              </span>
              <button
                style={{
                  ...styles.translateBtn,
                  opacity: loading || !input.trim() ? 0.5 : 1,
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                }}
                onClick={translate}
                disabled={loading || !input.trim()}
              >
                {loading ? 'traduciendo...' : 'TRADUCIR →'}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <div style={styles.dividerIcon}>
              {loading ? '⏳' : '⚡'}
            </div>
            <div style={styles.dividerLine} />
          </div>

          {/* Output panel */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <span style={{ ...styles.panelLabel, background: '#00e676' }}>
                ESPAÑOL NORMAL ✅
              </span>
              {output && (
                <button style={styles.ghostBtn} onClick={copyOutput}>
                  {copied ? '¡copiado! ✓' : 'copiar'}
                </button>
              )}
            </div>
            <div style={styles.outputBox}>
              {error ? (
                <p style={{ color: '#ff3c6f', fontFamily: 'Space Mono', fontSize: '14px' }}>
                  {error}
                </p>
              ) : loading ? (
                <div style={styles.loadingDots}>
                  <span>.</span><span>.</span><span>.</span>
                </div>
              ) : output ? (
                <p style={styles.outputText}>{output}</p>
              ) : (
                <p style={styles.placeholder}>
                  La traducción aparecerá aquí...
                </p>
              )}
            </div>
            {output && (
              <div style={styles.panelFooter}>
                <span style={{ fontSize: '12px', opacity: 0.5 }}>
                  {output.length} caracteres
                </span>
                <span style={{ fontSize: '12px', opacity: 0.5 }}>powered by Claude AI</span>
              </div>
            )}
          </div>
        </div>

        {/* Dictionary strip */}
        <div style={styles.dict}>
          <p style={styles.dictTitle}>MINI DICCIONARIO GEN Z →</p>
          <div style={styles.dictGrid}>
            {[
              ['no cap', 'en serio / sin mentira'],
              ['lowkey', 'a secreta / un poco'],
              ['slay', 'lo está rompiendo'],
              ['fr fr', 'de verdad / en serio'],
              ['mid', 'mediocre / del montón'],
              ['ick', 'algo que da asco'],
              ['red flag', 'señal de alarma'],
              ['it\'s giving', 'tiene vibras de'],
              ['periodt', 'punto final / y ya'],
              ['ngl', 'siendo honesto/a'],
              ['bestie', 'mejor amig@'],
              ['vibe check', 'verificar el ambiente'],
            ].map(([genz, normal]) => (
              <div key={genz} style={styles.dictItem}>
                <span style={styles.dictGenz}>{genz}</span>
                <span style={styles.dictArrow}>→</span>
                <span style={styles.dictNormal}>{normal}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <p>Hecho con 💀 y Claude AI · No cap, te va a ayudar con tus abuel@s</p>
      </footer>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes dots {
          0%, 20% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        .dot1 { animation: dots 1.4s infinite 0s; }
        .dot2 { animation: dots 1.4s infinite 0.2s; }
        .dot3 { animation: dots 1.4s infinite 0.4s; }
      `}</style>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#f5f0e8',
  },
  header: {
    borderBottom: '3px solid #0a0a0a',
    background: '#0a0a0a',
    color: '#f5f0e8',
    overflow: 'hidden',
  },
  headerInner: {
    padding: '40px 40px 30px',
    position: 'relative',
  },
  badge: {
    display: 'inline-block',
    background: '#ffe135',
    color: '#0a0a0a',
    fontFamily: 'Space Mono, monospace',
    fontWeight: '700',
    fontSize: '11px',
    padding: '4px 10px',
    border: '2px solid #ffe135',
    marginBottom: '12px',
    letterSpacing: '2px',
  },
  title: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 'clamp(52px, 10vw, 96px)',
    fontWeight: '800',
    lineHeight: '0.9',
    color: '#f5f0e8',
    letterSpacing: '-2px',
    marginBottom: '16px',
  },
  subtitle: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '14px',
    color: '#ffe135',
    opacity: 0.9,
  },
  ticker: {
    borderTop: '2px solid #2a2a2a',
    padding: '12px 0',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  tickerInner: {
    display: 'inline-block',
    animation: 'ticker 30s linear infinite',
  },
  tickerItem: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '12px',
    color: '#666',
    paddingRight: '8px',
  },
  main: {
    flex: 1,
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    gap: '0',
    border: '3px solid #0a0a0a',
    boxShadow: '8px 8px 0px #0a0a0a',
    background: '#fff',
    marginBottom: '40px',
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '360px',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '3px solid #0a0a0a',
    background: '#fafafa',
    gap: '8px',
    flexWrap: 'wrap',
  },
  panelLabel: {
    fontFamily: 'Space Mono, monospace',
    fontWeight: '700',
    fontSize: '11px',
    letterSpacing: '1.5px',
    padding: '4px 10px',
    border: '2px solid #0a0a0a',
  },
  panelActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  ghostBtn: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '11px',
    background: 'transparent',
    border: '1.5px solid #ccc',
    padding: '4px 10px',
    cursor: 'pointer',
    color: '#555',
    transition: 'all 0.15s',
  },
  textarea: {
    flex: 1,
    border: 'none',
    outline: 'none',
    padding: '20px',
    fontFamily: 'Space Mono, monospace',
    fontSize: '14px',
    lineHeight: '1.7',
    resize: 'none',
    background: 'transparent',
    color: '#0a0a0a',
    minHeight: '260px',
  },
  panelFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderTop: '2px solid #eee',
    background: '#fafafa',
  },
  translateBtn: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: '800',
    fontSize: '13px',
    letterSpacing: '1px',
    background: '#0a0a0a',
    color: '#ffe135',
    border: '2px solid #0a0a0a',
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    boxShadow: '3px 3px 0 #ffe135',
  },
  divider: {
    width: '3px',
    background: '#0a0a0a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dividerLine: {
    flex: 1,
    width: '100%',
    background: '#0a0a0a',
  },
  dividerIcon: {
    width: '36px',
    height: '36px',
    background: '#ffe135',
    border: '3px solid #0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
    margin: '8px -16.5px',
    zIndex: 1,
  },
  outputBox: {
    flex: 1,
    padding: '20px',
    minHeight: '260px',
    display: 'flex',
    alignItems: 'flex-start',
  },
  outputText: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '14px',
    lineHeight: '1.7',
    color: '#0a0a0a',
  },
  placeholder: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '14px',
    color: '#bbb',
    fontStyle: 'italic',
  },
  loadingDots: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '28px',
    color: '#0a0a0a',
    display: 'flex',
    gap: '4px',
  },
  dict: {
    border: '3px solid #0a0a0a',
    boxShadow: '8px 8px 0px #0a0a0a',
    background: '#fff',
    padding: '24px',
  },
  dictTitle: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: '800',
    fontSize: '13px',
    letterSpacing: '2px',
    marginBottom: '20px',
    color: '#0a0a0a',
  },
  dictGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '10px',
  },
  dictItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    border: '1.5px solid #e0e0e0',
    background: '#fafafa',
  },
  dictGenz: {
    fontFamily: 'Space Mono, monospace',
    fontWeight: '700',
    fontSize: '12px',
    color: '#1a1aff',
    flexShrink: 0,
  },
  dictArrow: {
    fontSize: '12px',
    color: '#999',
    flexShrink: 0,
  },
  dictNormal: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '11px',
    color: '#555',
  },
  footer: {
    borderTop: '3px solid #0a0a0a',
    padding: '16px 40px',
    background: '#0a0a0a',
    color: '#555',
    fontFamily: 'Space Mono, monospace',
    fontSize: '12px',
    textAlign: 'center',
  },
}
