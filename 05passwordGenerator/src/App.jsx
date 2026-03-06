import { useState, useCallback, useEffect, useRef } from 'react'

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'

function getStrength(pwd, opts) {
  let s = 0
  if (pwd.length >= 12) s++
  if (pwd.length >= 16) s++
  if (opts.upper) s++
  if (opts.lower) s++
  if (opts.numbers) s++
  if (opts.symbols) s++
  if (s <= 2) return { label: 'Weak', pct: 20, color: '#6b3a3a' }
  if (s <= 3) return { label: 'Fair', pct: 45, color: '#7a6040' }
  if (s <= 5) return { label: 'Strong', pct: 72, color: '#8a9a7a' }
  return { label: 'Excellent', pct: 100, color: '#c8bfa8' }
}

export default function App() {
  const [length, setLength] = useState(16)
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: false })
  const [exclude, setExclude] = useState(false)
  const [password, setPassword] = useState('')
  const [displayPwd, setDisplayPwd] = useState('')
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [lengthAnim, setLengthAnim] = useState(false)
  const scrambleRef = useRef(null)

  useEffect(() => {
    setTimeout(() => setMounted(true), 60)
  }, [])

  const scrambleTo = useCallback((finalPwd) => {
    if (scrambleRef.current) clearInterval(scrambleRef.current)
    let frame = 0
    const totalFrames = 18
    scrambleRef.current = setInterval(() => {
      frame++
      const revealed = Math.floor((frame / totalFrames) * finalPwd.length)
      const scrambled = finalPwd.split('').map((ch, i) => {
        if (i < revealed) return ch
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      }).join('')
      setDisplayPwd(scrambled)
      if (frame >= totalFrames) {
        clearInterval(scrambleRef.current)
        setDisplayPwd(finalPwd)
        setGenerating(false)
      }
    }, 35)
  }, [])

  const generate = useCallback(() => {
    let pool = ''
    if (opts.upper) pool += UPPERCASE
    if (opts.lower) pool += LOWERCASE
    if (opts.numbers) pool += NUMBERS
    if (opts.symbols) pool += SYMBOLS
    if (exclude) pool = pool.replace(/[0OIl1]/g, '')
    if (!pool) return
    const arr = new Uint32Array(length)
    crypto.getRandomValues(arr)
    const pwd = Array.from(arr).map(n => pool[n % pool.length]).join('')
    setPassword(pwd)
    setHistory(p => [pwd, ...p].slice(0, 6))
    setCopied(false)
    setGenerating(true)
    scrambleTo(pwd)
  }, [length, opts, exclude, scrambleTo])

  useEffect(() => { generate() }, [])

  const copy = () => {
    if (!password) return
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const toggle = k => setOpts(p => ({ ...p, [k]: !p[k] }))

  const handleLength = (e) => {
    setLength(+e.target.value)
    setLengthAnim(true)
    setTimeout(() => setLengthAnim(false), 300)
  }

  const str = getStrength(password, opts)
  const sliderPct = ((length - 4) / 28) * 100

  return (
    <div style={{ minHeight: '100vh', background: '#0e0c09', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>

      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@300;400;500;700&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet" />

      <style>{`
        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes lenPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        @keyframes pwdIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes btnPulse {
          0%   { box-shadow: 0 0 0 0 rgba(200,191,168,0.18); }
          60%  { box-shadow: 0 0 0 8px rgba(200,191,168,0); }
          100% { box-shadow: 0 0 0 0 rgba(200,191,168,0); }
        }
        @keyframes histSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes checkmark {
          0%   { transform: scale(0.6); opacity: 0; }
          60%  { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes strGrow {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }

        .wrap { width: 100%; max-width: 420px; }

        .block { opacity: 0; }
        .block.in { animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) forwards; }

        .heading { margin-bottom: 56px; }
        .heading-eyebrow { font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 300; letter-spacing: 5px; color: #2e2920; text-transform: uppercase; margin-bottom: 14px; }
        .heading-title { font-family: 'Syne', sans-serif; font-size: 44px; font-weight: 700; color: #c8bfa8; letter-spacing: -1.5px; line-height: 1.0; }

        .pwd-block { margin-bottom: 36px; }
        .pwd-row { display: flex; align-items: flex-start; gap: 18px; padding-bottom: 16px; border-bottom: 1px solid #1e1b16; }
        .pwd-input { flex: 1; font-family: 'DM Mono', monospace; font-size: 14px; font-weight: 300; color: #c8bfa8; letter-spacing: 2.5px; background: transparent; border: none; outline: none; line-height: 1.75; word-break: break-all; padding: 0; }
        .pwd-input::placeholder { color: #1e1b16; }
        .copy-btn { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 300; letter-spacing: 3px; text-transform: uppercase; background: transparent; border: none; color: #2e2920; cursor: pointer; padding: 6px 0 4px; white-space: nowrap; transition: color 0.2s; line-height: 1; flex-shrink: 0; }
        .copy-btn:hover { color: #c8bfa8; }
        .copy-btn.on { color: #8a9a7a; }
        .copy-check { display: inline-block; animation: checkmark 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }

        .str-meta { display: flex; justify-content: space-between; margin-top: 12px; margin-bottom: 8px; }
        .str-text { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 3px; color: #2a2520; text-transform: uppercase; font-weight: 300; }
        .str-track { height: 1px; background: #181410; overflow: hidden; }
        .str-fill { height: 100%; transition: width 0.6s cubic-bezier(0.16,1,0.3,1), background 0.5s ease; }

        .sep { height: 1px; background: #181410; margin: 40px 0; }

        .field-label { font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 300; letter-spacing: 4px; color: #2a2520; text-transform: uppercase; display: block; margin-bottom: 18px; }

        .slider-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 20px; }
        .slider-big { font-family: 'Syne', sans-serif; font-size: 72px; font-weight: 700; color: #c8bfa8; line-height: 1; letter-spacing: -4px; display: inline-block; transition: color 0.15s; }
        .slider-big.pop { animation: lenPop 0.28s cubic-bezier(0.34,1.56,0.64,1); }
        .slider-hint { font-family: 'DM Mono', monospace; font-size: 11px; color: #2a2520; letter-spacing: 2px; font-weight: 300; }

        input[type=range] { -webkit-appearance: none; width: 100%; height: 1px; border: none; outline: none; cursor: pointer; background: linear-gradient(90deg, #5a5040 ${sliderPct}%, #1e1b16 ${sliderPct}%); transition: background 0.05s; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #c8bfa8; border: 2px solid #0e0c09; outline: 1px solid #5a5040; cursor: pointer; transition: transform 0.15s; }
        input[type=range]:active::-webkit-slider-thumb { transform: scale(1.3); }

        .opts { display: flex; flex-direction: column; }
        .opt { display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #141210; cursor: pointer; transition: padding-left 0.2s ease; }
        .opt:first-child { border-top: 1px solid #141210; }
        .opt:hover { padding-left: 4px; }
        .opt-left { display: flex; flex-direction: column; gap: 3px; }
        .opt-name { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 400; transition: color 0.2s; }
        .opt-code { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 2px; color: #2a2520; font-weight: 300; font-style: italic; }
        .opt-pill { width: 28px; height: 14px; border-radius: 100px; border: 1px solid #2a2520; position: relative; transition: border-color 0.25s, background 0.25s; flex-shrink: 0; }
        .opt-pill-dot { position: absolute; top: 3px; width: 6px; height: 6px; border-radius: 50%; transition: left 0.25s cubic-bezier(0.34,1.56,0.64,1), background 0.25s; }

        .gen-btn { width: 100%; margin-top: 40px; padding: 19px; background: transparent; border: 1px solid #2a2520; border-radius: 1px; font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 300; letter-spacing: 7px; text-transform: uppercase; color: #5a5040; cursor: pointer; transition: border-color 0.2s, color 0.2s, background 0.2s; position: relative; overflow: hidden; }
        .gen-btn:hover { border-color: #5a5040; color: #c8bfa8; background: #111009; }
        .gen-btn:active { transform: scale(0.98); }
        .gen-btn.pulse { animation: btnPulse 0.5s ease-out; }
        .gen-btn::after { content: ''; position: absolute; inset: 0; background: rgba(200,191,168,0.04); opacity: 0; transition: opacity 0.2s; }
        .gen-btn:hover::after { opacity: 1; }

        .hist-btn { display: flex; align-items: center; gap: 14px; width: 100%; background: none; border: none; cursor: pointer; margin-top: 32px; padding: 0; }
        .hist-line { flex: 1; height: 1px; background: #141210; }
        .hist-text { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 4px; color: #252018; text-transform: uppercase; font-weight: 300; white-space: nowrap; transition: color 0.15s; }
        .hist-btn:hover .hist-text { color: #4a4030; }

        .hist-items { margin-top: 4px; animation: histSlide 0.3s cubic-bezier(0.16,1,0.3,1) both; }
        .hist-row { display: flex; align-items: center; justify-content: space-between; padding: 13px 0; border-bottom: 1px solid #101008; cursor: pointer; transition: padding-left 0.18s ease; }
        .hist-row:hover { padding-left: 4px; }
        .hist-row:hover .hist-pwd { color: #5a5040; }
        .hist-pwd { font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 300; color: #252018; letter-spacing: 1.5px; transition: color 0.15s; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80%; }
        .hist-n { font-family: 'DM Mono', monospace; font-size: 8px; color: #1e1b16; letter-spacing: 2px; }
      `}</style>

      <div className="wrap">

        {/* Heading */}
        <div className={`block heading${mounted ? ' in' : ''}`} style={{ animationDelay: '0ms' }}>
          <div className="heading-eyebrow"> manan vijay </div>
          <div className="heading-title">Password<br />Generator</div>
        </div>

        {/* Password Output */}
        <div className={`block pwd-block${mounted ? ' in' : ''}`} style={{ animationDelay: '80ms' }}>
          <div className="pwd-row">
            <input className="pwd-input" type="text" value={displayPwd} readOnly placeholder="——————————————" />
            <button className={`copy-btn${copied ? ' on' : ''}`} onClick={copy}>
              {copied
                ? <span className="copy-check">✓ copied</span>
                : 'copy'
              }
            </button>
          </div>
          <div className="str-meta">
            <span className="str-text">Strength</span>
            <span className="str-text" style={{ color: password ? str.color : '#2a2520', transition: 'color 0.4s' }}>
              {password ? str.label : '—'}
            </span>
          </div>
          <div className="str-track">
            <div className="str-fill" style={{ width: password ? `${str.pct}%` : '0%', background: str.color }} />
          </div>
        </div>

        <div className={`block sep${mounted ? ' in' : ''}`} style={{ animationDelay: '140ms', marginTop: 0 }} />

        {/* Length */}
        <div className={`block${mounted ? ' in' : ''}`} style={{ animationDelay: '180ms', marginBottom: '44px' }}>
          <span className="field-label">Length</span>
          <div className="slider-header">
            <span className={`slider-big${lengthAnim ? ' pop' : ''}`}>{length}</span>
            <span className="slider-hint">4 — 32</span>
          </div>
          <input type="range" min="4" max="32" value={length} onChange={handleLength} />
        </div>

        {/* Options */}
        <div className={`block${mounted ? ' in' : ''}`} style={{ animationDelay: '240ms', marginBottom: 0 }}>
          <span className="field-label">Character Set</span>
          <div className="opts">
            {[
              { key: 'upper',  name: 'Uppercase',         code: 'A–Z'     },
              { key: 'lower',  name: 'Lowercase',         code: 'a–z'     },
              { key: 'numbers',name: 'Numbers',           code: '0–9'     },
              { key: 'symbols',name: 'Symbols',           code: '!@#$%'   },
              { key: '_excl',  name: 'Exclude Ambiguous', code: '0 O I l 1' },
            ].map(({ key, name, code }) => {
              const on = key === '_excl' ? exclude : opts[key]
              const handleClick = key === '_excl' ? () => setExclude(p => !p) : () => toggle(key)
              return (
                <div key={key} className="opt" onClick={handleClick}>
                  <div className="opt-left">
                    <span className="opt-name" style={{ color: on ? '#c8bfa8' : '#3a3228' }}>{name}</span>
                    <span className="opt-code">{code}</span>
                  </div>
                  <div className="opt-pill" style={{ borderColor: on ? '#6a5f4e' : '#2a2520', background: on ? '#1a1710' : 'transparent' }}>
                    <div className="opt-pill-dot" style={{ background: on ? '#c8bfa8' : '#2a2520', left: on ? '16px' : '3px' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Generate */}
        <div className={`block${mounted ? ' in' : ''}`} style={{ animationDelay: '300ms' }}>
          <GenButton onClick={generate} />
        </div>

        {/* History */}
        {history.length > 1 && (
          <div className={`block${mounted ? ' in' : ''}`} style={{ animationDelay: '340ms' }}>
            <button className="hist-btn" onClick={() => setShowHistory(p => !p)}>
              <span className="hist-line" />
              <span className="hist-text">History</span>
              <span className="hist-line" />
            </button>
            {showHistory && (
              <div className="hist-items">
                {history.slice(1).map((p, i) => (
                  <div key={i} className="hist-row" onClick={() => { setPassword(p); setDisplayPwd(p); setCopied(false) }}>
                    <span className="hist-pwd">{p}</span>
                    <span className="hist-n">0{i + 2}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function GenButton({ onClick }) {
  const [pulse, setPulse] = useState(false)
  const handle = () => {
    setPulse(false)
    requestAnimationFrame(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 600)
    })
    onClick()
  }
  return (
    <button className={`gen-btn${pulse ? ' pulse' : ''}`} onClick={handle}>
      Generate
    </button>
  )
}