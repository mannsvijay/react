import { useState } from 'react';
import { InputBox } from './components';
import useCurrencyInfo from './hooks/useCurrencyInfo';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cc-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #40513B;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    position: relative;
    overflow: hidden;
  }

  .cc-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
  }
  .cc-blob-1 { width: 420px; height: 420px; background: #609966; opacity: 0.25; top: -140px; left: -120px; }
  .cc-blob-2 { width: 320px; height: 320px; background: #9DC08B; opacity: 0.15; bottom: -100px; right: -80px; }
  .cc-blob-3 { width: 180px; height: 180px; background: #EDF1D6; opacity: 0.07; top: 55%; left: 62%; }

  .cc-card {
    width: 100%;
    max-width: 420px;
    background: rgba(237,241,214,0.06);
    border: 1px solid rgba(157,192,139,0.18);
    border-radius: 32px;
    padding: 36px 32px;
    backdrop-filter: blur(28px);
    position: relative;
    z-index: 1;
    animation: cardIn 0.65s cubic-bezier(0.34,1.2,0.64,1) forwards;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(32px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .cc-header {
    text-align: center;
    margin-bottom: 30px;
    animation: fadeUp 0.6s 0.15s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .cc-eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #9DC08B;
    margin-bottom: 7px;
  }

  .cc-title {
    font-size: 27px;
    font-weight: 300;
    color: #EDF1D6;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }
  .cc-title b { font-weight: 700; color: #9DC08B; }

  /* Inputs area */
  .cc-inputs {
    display: flex;
    flex-direction: column;
    gap: 0;
    animation: fadeUp 0.6s 0.25s ease both;
  }

  /* Swap divider */
  .cc-divider {
    position: relative;
    height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    margin: 10px 0;
  }

  .cc-line {
    position: absolute;
    width: 100%;
    height: 1px;
    background: rgba(157,192,139,0.2);
  }

  .cc-swap-btn {
    position: relative;
    width: 40px; height: 40px;
    border-radius: 50%;
    background: #40513B;
    border: 2px solid #609966;
    color: #9DC08B;
    font-size: 17px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    z-index: 2;
  }

  .cc-swap-btn:hover {
    background: #609966;
    color: #EDF1D6;
    transform: rotate(180deg) scale(1.12);
    border-color: #9DC08B;
    box-shadow: 0 6px 28px rgba(64,81,59,0.5);
  }
  .cc-swap-btn:active { transform: rotate(180deg) scale(0.95); }

  /* Rate strip */
  .cc-rate {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(237,241,214,0.06);
    border: 1px solid rgba(157,192,139,0.15);
    border-radius: 14px;
    padding: 12px 18px;
    margin: 18px 0 0;
    animation: fadeUp 0.6s 0.35s ease both;
  }

  .cc-rate-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #9DC08B;
    opacity: 0.7;
  }

  .cc-rate-value {
    font-family: 'DM Mono', monospace;
    font-size: 12.5px;
    color: #EDF1D6;
    font-weight: 400;
  }

  .cc-live-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #9DC08B;
    animation: pulse 1.8s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(157,192,139,0.6); }
    50%       { box-shadow: 0 0 0 5px rgba(157,192,139,0); }
  }

  /* Convert button */
  .cc-btn {
    margin-top: 20px;
    width: 100%;
    padding: 16px;
    border-radius: 16px;
    border: none;
    background: #609966;
    color: #EDF1D6;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1),
                box-shadow 0.25s ease,
                background 0.25s ease;
    animation: fadeUp 0.6s 0.4s ease both;
  }

  .cc-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(237,241,214,0.15) 0%, transparent 60%);
    pointer-events: none;
  }

  .cc-btn::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 0; height: 0;
    background: rgba(237,241,214,0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.5s ease, height 0.5s ease, opacity 0.5s ease;
    opacity: 0;
  }

  .cc-btn:hover {
    background: #40513B;
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(64,81,59,0.5);
  }

  .cc-btn:active {
    transform: scale(0.97);
  }

  .cc-btn:active::after {
    width: 300px; height: 300px; opacity: 0;
  }
`;

// ── Inline InputBox (styled version — drop-in replacement) ─────────────────
const ibStyles = `
  .ib-card {
    background: #EDF1D6;
    border-radius: 20px;
    padding: 20px 22px;
    border: 2px solid transparent;
    transition: all 0.32s ease;
    cursor: text;
    position: relative;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
  }

  .ib-card::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 55%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(157,192,139,0.18), transparent);
    pointer-events: none;
  }
  .ib-card.ib-focused::before { animation: ibShimmer 2.2s ease-in-out infinite; }

  @keyframes ibShimmer {
    0%   { left: -100%; }
    100% { left: 200%; }
  }

  .ib-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
  .ib-card.ib-focused {
    border-color: #609966;
    box-shadow: 0 0 0 5px rgba(96,153,102,0.18), 0 8px 32px rgba(0,0,0,0.08);
    transform: translateY(-3px);
  }

  .ib-label {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: #609966; margin-bottom: 10px;
    display: flex; align-items: center; gap: 7px;
    transition: color 0.3s;
  }
  .ib-card.ib-focused .ib-label { color: #40513B; }

  .ib-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #9DC08B; flex-shrink: 0;
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .ib-card.ib-focused .ib-dot {
    background: #609966;
    transform: scale(1.7);
    box-shadow: 0 0 0 3px rgba(96,153,102,0.22);
  }

  .ib-body { display: flex; align-items: center; gap: 14px; }

  .ib-amount {
    font-family: 'DM Mono', monospace;
    font-size: 34px; font-weight: 400;
    color: #40513B; background: transparent;
    border: none; outline: none; width: 100%;
    letter-spacing: -0.03em;
    -moz-appearance: textfield;
  }
  .ib-amount::-webkit-inner-spin-button,
  .ib-amount::-webkit-outer-spin-button { -webkit-appearance: none; }
  .ib-amount::placeholder { color: #9DC08B; opacity: 0.55; font-weight: 300; }
  .ib-amount:disabled { color: #40513B; opacity: 0.88; cursor: default; }

  .ib-pill {
    display: flex; align-items: center; gap: 8px;
    background: #40513B; color: #EDF1D6;
    border: none; border-radius: 14px;
    padding: 10px 14px; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600; font-size: 13px;
    letter-spacing: 0.05em; white-space: nowrap;
    flex-shrink: 0; position: relative; overflow: hidden;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
  }
  .ib-pill::after {
    content: ''; position: absolute; inset: 0;
    background: #609966;
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.28s ease; z-index: 0;
    border-radius: 14px;
  }
  .ib-pill:hover::after { transform: scaleX(1); }
  .ib-pill > * { position: relative; z-index: 1; }
  .ib-pill:hover { transform: scale(1.05); box-shadow: 0 5px 18px rgba(64,81,59,0.28); }
  .ib-pill:active { transform: scale(0.96); }

  .ib-chevron {
    font-size: 9px; opacity: 0.6;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .ib-chevron.open { transform: rotate(180deg); }

  .ib-dropdown {
    position: absolute;
    bottom: calc(100% + 10px); right: 0;
    background: #EDF1D6;
    border: 1.5px solid #9DC08B;
    border-radius: 18px; padding: 8px;
    min-width: 195px; z-index: 100;
    box-shadow: 0 -16px 48px rgba(0,0,0,0.16);
    animation: dropUp 0.26s cubic-bezier(0.34,1.56,0.64,1) forwards;
    transform-origin: bottom right;
  }

  @keyframes dropUp {
    from { opacity: 0; transform: scale(0.86) translateY(10px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);    }
  }

  .ib-option {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 13px; border-radius: 11px;
    cursor: pointer; font-size: 13px; font-weight: 500;
    color: #40513B;
    transition: all 0.16s ease;
  }
  .ib-option:hover { background: rgba(64,81,59,0.08); transform: translateX(4px); }
  .ib-option.ib-active { background: #40513B; color: #EDF1D6; }

  .ib-sym {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: #609966;
    margin-left: auto; opacity: 0.8;
  }
  .ib-option.ib-active .ib-sym { color: #9DC08B; }
`;

const CURRENCIES = [
  { code: "USD", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", flag: "🇬🇧" },
  { code: "INR", symbol: "₹", flag: "🇮🇳" },
  { code: "JPY", symbol: "¥", flag: "🇯🇵" },
  { code: "AED", symbol: "د.إ", flag: "🇦🇪" },
  { code: "CAD", symbol: "C$", flag: "🇨🇦" },
  { code: "SGD", symbol: "S$", flag: "🇸🇬" },
];

function InputBox({ label, amount, onAmountChange, currencyValue, onCurrencyChange }) {
  const [focused, setFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef(null);

  const selected = CURRENCIES.find(c => c.code === currencyValue) || CURRENCIES[0];

  return (
    <>
      <style>{ibStyles}</style>
      <div
        className={`ib-card ${focused ? "ib-focused" : ""}`}
        onClick={() => !amountDisable && inputRef.current?.focus()}
      >
        <div className="ib-label">
          <span className="ib-dot" />
          {label}
        </div>
        <div className="ib-body">
          <input
            ref={inputRef}
            className="ib-amount"
            type="number"
            placeholder="0.00"
            value={amount}
            disabled={amountDisable}
            onChange={e => onAmountChange && onAmountChange(Number(e.target.value))}
            onFocus={() => setFocused(true)}
            onBlur={() => { setFocused(false); setTimeout(() => setDropdownOpen(false), 150); }}
          />
          <div style={{ position: "relative" }}>
            <button
              className="ib-pill"
              disabled={currencyDisable}
              onMouseDown={e => e.preventDefault()}
              onClick={e => { e.stopPropagation(); if (!currencyDisable) setDropdownOpen(p => !p); }}
            >
              <span>{selected.flag}</span>
              <span>{selected.code}</span>
              {!currencyDisable && <span className={`ib-chevron ${dropdownOpen ? "open" : ""}`}>▼</span>}
            </button>
            {dropdownOpen && !currencyDisable && (
              <div className="ib-dropdown">
                {selectList.map(code => {
                  const c = CURRENCIES.find(x => x.code === code) || { code, symbol: "", flag: "🌐" };
                  return (
                    <div
                      key={code}
                      className={`ib-option ${code === currencyValue ? "ib-active" : ""}`}
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => { onCurrencyChange && onCurrencyChange(code); setDropdownOpen(false); }}
                    >
                      <span>{c.flag}</span>
                      <span>{c.code}</span>
                      <span className="ib-sym">{c.symbol}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [amount, setAmount] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [converting, setConverting] = useState(false);
  const [done, setDone] = useState(false);

  const { data: currencyInfo } = useCurrencyInfo(fromCurrency);

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount(convertedAmount);
    setConvertedAmount(amount);
    setDone(false);
  };

  const convert = (e) => {
    e.preventDefault();
    setConverting(true);
    setDone(false);
    setTimeout(() => {
      setConvertedAmount(amount * (currencyInfo[toCurrency] || 1));
      setConverting(false);
      setDone(true);
    }, 520);
  };

  const rate = currencyInfo[toCurrency] || 1;
  const selectList = Object.keys(mockRates);

  return (
    <>
      <style>{styles}</style>
      <div className="cc-root">
        <div className="cc-blob cc-blob-1" />
        <div className="cc-blob cc-blob-2" />
        <div className="cc-blob cc-blob-3" />

        <div className="cc-card">
          {/* Header */}
          <div className="cc-header">
            <p className="cc-eyebrow">Real-time Exchange</p>
            <h1 className="cc-title">Currency <b>Converter</b></h1>
          </div>

          {/* Form */}
          <form onSubmit={convert}>
            <div className="cc-inputs">
              {/* From */}
              <InputBox
                label="You Send"
                amount={amount}
                onAmountChange={setAmount}
                currencyValue={fromCurrency}
                onCurrencyChange={setFromCurrency}
                selectList={selectList}
              />

              {/* Swap */}
              <div className="cc-divider">
                <div className="cc-line" />
                <button type="button" className="cc-swap-btn" onClick={swap} title="Swap">⇅</button>
              </div>

              {/* To */}
              <InputBox
                label="You Receive"
                amount={done ? parseFloat(convertedAmount.toFixed(4)) : 0}
                currencyValue={toCurrency}
                onCurrencyChange={setToCurrency}
                amountDisable
                selectList={selectList}
              />
            </div>

            {/* Rate strip */}
            <div className="cc-rate">
              <span className="cc-rate-label">Live Rate</span>
              <span className="cc-rate-value">
                1 {fromCurrency} = {rate.toLocaleString(undefined, { maximumFractionDigits: 4 })} {toCurrency}
              </span>
              <span className="cc-live-dot" />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="cc-btn"
              style={converting ? { opacity: 0.7, transform: "scale(0.98)" } : {}}
            >
              {converting ? "Converting…" : done ? "✓ Converted" : `Convert ${fromCurrency} → ${toCurrency}`}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}