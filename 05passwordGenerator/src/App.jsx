import { useState, useCallback, useEffect } from 'react'

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+~`|}{[]:;?><,./-='

function getStrength(password, opts) {
  let score = 0
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (opts.upper) score++
  if (opts.lower) score++
  if (opts.numbers) score++
  if (opts.symbols) score++
  if (score <= 2) return { label: 'Weak', color: '#c0392b', width: '25%' }
  if (score <= 3) return { label: 'Fair', color: '#e67e22', width: '50%' }
  if (score <= 5) return { label: 'Strong', color: '#b8a98e', width: '75%' }
  return { label: 'Very Strong', color: '#d4c8b0', width: '100%' }
}

export default function App() {
  const [length, setLength] = useState(12)
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: false })
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [generated, setGenerated] = useState(false)

  const generate = useCallback(() => {
    let pool = ''
    if (opts.upper) pool += UPPERCASE
    if (opts.lower) pool += LOWERCASE
    if (opts.numbers) pool += NUMBERS
    if (opts.symbols) pool += SYMBOLS
    if (excludeAmbiguous) pool = pool.replace(/[0OIl1]/g, '')
    if (!pool) return

    const arr = new Uint32Array(length)
    crypto.getRandomValues(arr)
    const pwd = Array.from(arr).map(n => pool[n % pool.length]).join('')
    setPassword(pwd)
    setGenerated(true)
    setHistory(prev => [pwd, ...prev].slice(0, 5))
    setCopied(false)
  }, [length, opts, excludeAmbiguous])

  useEffect(() => { generate() }, [])

  const copy = () => {
    if (!password) return
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const strength = getStrength(password, opts)
  const toggle = key => setOpts(p => ({ ...p, [key]: !p[key] }))

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#131009',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Outfit', sans-serif",
      padding: '24px 16px',
    },
    card: {
      width: '100%',
      maxWidth: '460px',
      background: 'linear-gradient(160deg, #1e1a14 0%, #16120d 100%)',
      border: '1px solid #2e2720',
      borderRadius: '20px',
      padding: '40px 36px',
      boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,200,176,0.06)',
      position: 'relative',
      overflow: 'hidden',
    },
    decorTop: {
      position: 'absolute',
      top: 0, left: 0, right: 0,
      height: '2px',
      background: 'linear-gradient(90deg, transparent, #b8a98e 40%, #d4c8b0 50%, #b8a98e 60%, transparent)',
    },
    title: {
      textAlign: 'center',
      marginBottom: '32px',
    },
    titleSmall: {
      display: 'block',
      fontSize: '9px',
      letterSpacing: '5px',
      color: '#7a6e5f',
      textTransform: 'uppercase',
      fontWeight: '500',
      marginBottom: '6px',
    },
    titleMain: {
      display: 'block',
      fontSize: '26px',
      fontWeight: '200',
      color: '#d4c8b0',
      letterSpacing: '3px',
      textTransform: 'uppercase',
    },
    outputWrap: {
      background: '#0f0d09',
      border: '1px solid #2e2720',
      borderRadius: '12px',
      padding: '16px 20px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minHeight: '58px',
    },
    passwordText: {
      flex: 1,
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      fontSize: '14px',
      fontWeight: '300',
      color: '#d4c8b0',
      letterSpacing: '1.5px',
      wordBreak: 'break-all',
      lineHeight: '1.5',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      width: '100%',
    },
    copyBtn: {
      background: copied ? '#2e2720' : 'transparent',
      border: '1px solid ' + (copied ? '#b8a98e' : '#3a3028'),
      borderRadius: '8px',
      padding: '8px 14px',
      color: copied ? '#d4c8b0' : '#7a6e5f',
      cursor: 'pointer',
      fontSize: '10px',
      letterSpacing: '2px',
      fontWeight: '500',
      textTransform: 'uppercase',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    },
    strengthBar: {
      height: '3px',
      background: '#1e1a14',
      borderRadius: '2px',
      marginBottom: '24px',
      overflow: 'hidden',
      position: 'relative',
    },
    strengthFill: {
      height: '100%',
      borderRadius: '2px',
      transition: 'width 0.4s ease, background-color 0.4s ease',
      background: strength.color,
      width: password ? strength.width : '0%',
    },
    strengthLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '11px',
      color: '#5a5040',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      marginBottom: '4px',
    },
    sliderSection: {
      marginBottom: '28px',
    },
    sliderLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: '12px',
    },
    sliderLabelText: {
      fontSize: '12px',
      color: '#7a6e5f',
      letterSpacing: '2px',
      textTransform: 'uppercase',
    },
    sliderValue: {
      fontSize: '24px',
      color: '#d4c8b0',
      fontWeight: '200',
      letterSpacing: '2px',
    },
    divider: {
      height: '1px',
      background: 'linear-gradient(90deg, transparent, #2e2720 30%, #2e2720 70%, transparent)',
      margin: '24px 0',
    },
    checkboxGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      marginBottom: '16px',
    },
    checkboxItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      padding: '10px 14px',
      background: '#0f0d09',
      border: '1px solid #2a2218',
      borderRadius: '10px',
      transition: 'all 0.2s ease',
    },
    checkboxItemActive: {
      background: '#1e1a14',
      border: '1px solid #4a3f32',
    },
    checkLabel: {
      fontSize: '12px',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      userSelect: 'none',
    },
    singleCheck: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      padding: '10px 14px',
      background: '#0f0d09',
      border: '1px solid #2a2218',
      borderRadius: '10px',
      marginBottom: '24px',
      transition: 'all 0.2s ease',
    },
    generateBtn: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(135deg, #3a2e20 0%, #2e2416 100%)',
      border: '1px solid #5a4a35',
      borderRadius: '12px',
      color: '#d4c8b0',
      fontSize: '11px',
      letterSpacing: '4px',
      textTransform: 'uppercase',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontFamily: "'Outfit', sans-serif",
      fontWeight: '500',
      position: 'relative',
      overflow: 'hidden',
    },
    historyToggle: {
      width: '100%',
      background: 'transparent',
      border: 'none',
      color: '#4a3f32',
      fontSize: '11px',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      cursor: 'pointer',
      marginTop: '16px',
      padding: '8px',
      fontFamily: "'Outfit', sans-serif",
      fontWeight: '400',
    },
    historyList: {
      marginTop: '12px',
      background: '#0a0806',
      border: '1px solid #1e1a14',
      borderRadius: '10px',
      overflow: 'hidden',
    },
    historyItem: {
      padding: '10px 16px',
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: '300',
      fontSize: '12px',
      color: '#5a5040',
      borderBottom: '1px solid #1a1710',
      cursor: 'pointer',
      transition: 'color 0.2s',
      letterSpacing: '1px',
    },
  }

  const checkboxOptions = [
    { key: 'upper', label: 'ABC', desc: 'Uppercase' },
    { key: 'lower', label: 'abc', desc: 'Lowercase' },
    { key: 'numbers', label: '123', desc: 'Numbers' },
    { key: 'symbols', label: '!@#', desc: 'Symbols' },
  ]

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600&family=JetBrains+Mono:wght@300;400&display=swap" rel="stylesheet" />

      <style>{`
        input[type='range'] {
          -webkit-appearance: none;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #b8a98e ${((length - 4) / 16) * 100}%, #2a2218 ${((length - 4) / 16) * 100}%);
          border-radius: 2px;
          outline: none;
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #d4c8b0;
          cursor: pointer;
          border: 3px solid #131009;
          box-shadow: 0 0 8px rgba(212,200,176,0.3);
        }
        .gen-btn:hover { background: linear-gradient(135deg, #4a3e2c 0%, #3a3020 100%) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important; }
        .copy-btn:hover { border-color: #b8a98e !important; color: #d4c8b0 !important; }
        .hist-item:hover { color: #b8a98e !important; }
        .hist-toggle:hover { color: #7a6e5f !important; }
      `}</style>

      <div style={styles.card}>
        <div style={styles.decorTop} />

        <div style={styles.title}>
          <span style={styles.titleSmall}>Secure</span>
          <span style={styles.titleMain}>Password Forge</span>
        </div>

        {/* Output */}
        <div style={styles.outputWrap}>
          <input
            type="text"
            value={password}
            readOnly
            style={styles.passwordText}
            placeholder="Click generate..."
          />
          <button onClick={copy} style={styles.copyBtn} className="copy-btn">
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        {/* Strength */}
        <div>
          <div style={styles.strengthLabel}>
            <span>Strength</span>
            <span style={{ color: strength.color }}>{password ? strength.label : '—'}</span>
          </div>
          <div style={styles.strengthBar}>
            <div style={styles.strengthFill} />
          </div>
        </div>

        {/* Length Slider */}
        <div style={styles.sliderSection}>
          <div style={styles.sliderLabel}>
            <span style={styles.sliderLabelText}>Length</span>
            <span style={styles.sliderValue}>{length}</span>
          </div>
          <input
            type="range"
            min="4"
            max="32"
            value={length}
            onChange={e => setLength(+e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ fontSize: '10px', color: '#3a3028', letterSpacing: '1px' }}>4</span>
            <span style={{ fontSize: '10px', color: '#3a3028', letterSpacing: '1px' }}>32</span>
          </div>
        </div>

        <div style={styles.divider} />

        {/* Character Options */}
        <div style={{ marginBottom: '12px', fontSize: '10px', color: '#4a3f32', letterSpacing: '3px', textTransform: 'uppercase' }}>
          Characters
        </div>
        <div style={styles.checkboxGrid}>
          {checkboxOptions.map(({ key, label, desc }) => (
            <div
              key={key}
              onClick={() => toggle(key)}
              style={opts[key] ? { ...styles.checkboxItem, ...styles.checkboxItemActive } : styles.checkboxItem}
            >
              <span style={{
                width: '18px', height: '18px', borderRadius: '4px',
                border: '1px solid ' + (opts[key] ? '#b8a98e' : '#3a3028'),
                background: opts[key] ? '#b8a98e' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.2s',
                fontSize: '10px', color: '#131009'
              }}>
                {opts[key] ? '✓' : ''}
              </span>
              <div>
                <div style={{ ...styles.checkLabel, color: opts[key] ? '#d4c8b0' : '#5a5040' }}>{label}</div>
                <div style={{ fontSize: '9px', color: '#4a3f32', letterSpacing: '1px' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Exclude Ambiguous */}
        <div
          onClick={() => setExcludeAmbiguous(p => !p)}
          style={excludeAmbiguous ? { ...styles.singleCheck, ...styles.checkboxItemActive } : styles.singleCheck}
        >
          <span style={{
            width: '18px', height: '18px', borderRadius: '4px',
            border: '1px solid ' + (excludeAmbiguous ? '#b8a98e' : '#3a3028'),
            background: excludeAmbiguous ? '#b8a98e' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 0.2s', fontSize: '10px', color: '#131009'
          }}>
            {excludeAmbiguous ? '✓' : ''}
          </span>
          <div>
            <div style={{ ...styles.checkLabel, color: excludeAmbiguous ? '#d4c8b0' : '#5a5040' }}>Exclude Ambiguous</div>
            <div style={{ fontSize: '9px', color: '#4a3f32', letterSpacing: '1px' }}>Removes 0, O, I, l, 1</div>
          </div>
        </div>

        {/* Generate Button */}
        <button onClick={generate} style={styles.generateBtn} className="gen-btn">
          ⟳ &nbsp; Generate Password
        </button>

        {/* History */}
        {history.length > 1 && (
          <>
            <button
              onClick={() => setShowHistory(p => !p)}
              style={styles.historyToggle}
              className="hist-toggle"
            >
              {showHistory ? '▲' : '▼'} &nbsp; Recent Passwords
            </button>
            {showHistory && (
              <div style={styles.historyList}>
                {history.slice(1).map((p, i) => (
                  <div
                    key={i}
                    style={styles.historyItem}
                    className="hist-item"
                    onClick={() => { setPassword(p); setCopied(false) }}
                    title="Click to restore"
                  >
                    {p}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}