import { useState } from "react";
import { InputBox } from "./components";
import useCurrencyInfo from "./hooks/useCurrencyInfo";

const CURRENCY_LIST = [
  "USD","EUR","GBP","INR","JPY",
  "AED","CAD","SGD","CHF","AUD",
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { margin: 0; }

  .cc {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #40513B;
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    position: relative; overflow: hidden;
  }

  /* Ambient blobs */
  .cc__blob {
    position: absolute; border-radius: 50%;
    filter: blur(90px); pointer-events: none;
  }
  .cc__blob--1 { width:440px; height:440px; background:#609966; opacity:0.22; top:-150px; left:-130px; }
  .cc__blob--2 { width:300px; height:300px; background:#9DC08B; opacity:0.13; bottom:-90px; right:-70px; }
  .cc__blob--3 { width:180px; height:180px; background:#EDF1D6; opacity:0.06; top:50%; left:65%; }

  /* Card */
  .cc__card {
    width: 100%; max-width: 420px;
    background: rgba(237,241,214,0.06);
    border: 1px solid rgba(157,192,139,0.18);
    border-radius: 32px; padding: 36px 32px;
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    position: relative; z-index: 1;
    animation: ccCardIn 0.65s cubic-bezier(0.34,1.2,0.64,1) both;
  }
  @keyframes ccCardIn {
    from { opacity:0; transform: translateY(30px) scale(0.96); }
    to   { opacity:1; transform: translateY(0) scale(1); }
  }
  @keyframes ccFadeUp {
    from { opacity:0; transform: translateY(12px); }
    to   { opacity:1; transform: translateY(0); }
  }

  /* Header */
  .cc__header {
    text-align: center; margin-bottom: 28px;
    animation: ccFadeUp 0.5s 0.2s ease both;
  }
  .cc__eyebrow {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: #9DC08B; margin-bottom: 6px;
  }
  .cc__title {
    font-size: 26px; font-weight: 300;
    color: #EDF1D6; letter-spacing: -0.02em;
  }
  .cc__title b { font-weight: 700; color: #9DC08B; }

  /* Inputs */
  .cc__inputs {
    display: flex; flex-direction: column; gap: 0;
    animation: ccFadeUp 0.5s 0.3s ease both;
  }

  /* Swap */
  .cc__divider {
    position: relative; height: 0;
    display: flex; align-items: center; justify-content: center;
    z-index: 10; margin: 10px 0;
  }
  .cc__line {
    position: absolute; width: 100%; height: 1px;
    background: rgba(157,192,139,0.18);
  }
  .cc__swap {
    position: relative;
    width: 40px; height: 40px; border-radius: 50%;
    background: #40513B; border: 2px solid #609966;
    color: #9DC08B; font-size: 17px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 4px 18px rgba(0,0,0,0.22);
  }
  .cc__swap:hover {
    background: #609966; color: #EDF1D6;
    transform: rotate(180deg) scale(1.12);
    border-color: #9DC08B;
    box-shadow: 0 6px 26px rgba(64,81,59,0.45);
  }
  .cc__swap:active { transform: rotate(180deg) scale(0.95); }

  /* Rate strip */
  .cc__rate {
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(237,241,214,0.05);
    border: 1px solid rgba(157,192,139,0.14);
    border-radius: 14px; padding: 11px 16px;
    margin-top: 16px; min-height: 42px;
    animation: ccFadeUp 0.5s 0.4s ease both;
  }
  .cc__rate-label {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: #9DC08B; opacity: 0.65;
  }
  .cc__rate-value {
    font-family: 'DM Mono', monospace;
    font-size: 12px; color: #EDF1D6;
  }
  .cc__rate-muted {
    font-size: 11px; color: #9DC08B;
    opacity: 0.5; font-style: italic;
  }
  .cc__live-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #9DC08B; flex-shrink: 0;
    animation: ccPulse 1.8s ease-in-out infinite;
  }
  @keyframes ccPulse {
    0%,100% { box-shadow: 0 0 0 0   rgba(157,192,139,0.7); }
    50%      { box-shadow: 0 0 0 5px rgba(157,192,139,0);   }
  }

  /* Error */
  .cc__error {
    font-size: 11px; color: #ff8a80; text-align: center;
    margin-top: 8px; animation: ccFadeUp 0.3s ease both;
  }

  /* Convert button */
  .cc__btn {
    margin-top: 18px; width: 100%; padding: 15px;
    border-radius: 16px; border: none;
    background: #609966; color: #EDF1D6;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    cursor: pointer; position: relative; overflow: hidden;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1),
                box-shadow 0.25s ease, background 0.25s ease, opacity 0.2s;
    animation: ccFadeUp 0.5s 0.45s ease both;
  }
  .cc__btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(237,241,214,0.14) 0%, transparent 55%);
    pointer-events: none;
  }
  .cc__btn:not(:disabled):hover {
    background: #40513B;
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(64,81,59,0.45);
  }
  .cc__btn:not(:disabled):active { transform: scale(0.97); }
  .cc__btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .cc__btn--done { background: #40513B; }
`;

export default function App() {
  const [amount,        setAmount]      = useState("");
  const [fromCurrency,  setFrom]        = useState("USD");
  const [toCurrency,    setTo]          = useState("INR");
  const [converted,     setConverted]   = useState("");
  const [converting,    setConverting]  = useState(false);
  const [done,          setDone]        = useState(false);

  // Your hook — returns { data, loading, error }
  const { data: currencyInfo, loading, error } = useCurrencyInfo(fromCurrency);

  const swap = () => {
    setFrom(toCurrency);
    setTo(fromCurrency);
    setAmount(converted);
    setConverted(amount);
    setDone(false);
  };

  const convert = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;
    setConverting(true);
    setDone(false);
    setTimeout(() => {
      const rate = currencyInfo?.[toCurrency] || 1;
      setConverted(parseFloat((Number(amount) * rate).toFixed(4)));
      setConverting(false);
      setDone(true);
    }, 500);
  };

  const rate = currencyInfo?.[toCurrency];

  const btnLabel = converting
    ? "Converting…"
    : done
    ? "✓ Converted"
    : `Convert ${fromCurrency} → ${toCurrency}`;

  return (
    <>
      <style>{css}</style>
      <div className="cc">
        <div className="cc__blob cc__blob--1" />
        <div className="cc__blob cc__blob--2" />
        <div className="cc__blob cc__blob--3" />

        <div className="cc__card">
          {/* Header */}
          <div className="cc__header">
            <p className="cc__eyebrow">Real-time Exchange</p>
            <h1 className="cc__title">Currency <b>Converter</b></h1>
          </div>

          <form onSubmit={convert}>
            <div className="cc__inputs">

              {/* FROM */}
              <InputBox
                label="You Send"
                amount={amount}
                onAmountChange={(val) => { setAmount(val); setDone(false); }}
                currencyValue={fromCurrency}
                onCurrencyChange={(c) => { setFrom(c); setDone(false); }}
                selectList={CURRENCY_LIST}
              />

              {/* SWAP */}
              <div className="cc__divider">
                <div className="cc__line" />
                <button type="button" className="cc__swap" onClick={swap} title="Swap currencies">
                  ⇅
                </button>
              </div>

              {/* TO — amount is read-only (no onAmountChange) */}
              <InputBox
                label="You Receive"
                amount={done ? converted : ""}
                currencyValue={toCurrency}
                onCurrencyChange={(c) => { setTo(c); setDone(false); }}
                selectList={CURRENCY_LIST}
              />

            </div>

            {/* Rate strip */}
            <div className="cc__rate">
              <span className="cc__rate-label">Live Rate</span>
              {loading
                ? <span className="cc__rate-muted">Fetching…</span>
                : rate
                ? <span className="cc__rate-value">
                    1 {fromCurrency} = {rate.toLocaleString(undefined, { maximumFractionDigits: 4 })} {toCurrency}
                  </span>
                : <span className="cc__rate-muted">—</span>
              }
              <span className="cc__live-dot" />
            </div>

            {error && <p className="cc__error">⚠ Could not fetch rates. Check your connection.</p>}

            {/* Convert */}
            <button
              type="submit"
              className={`cc__btn ${done ? "cc__btn--done" : ""}`}
              disabled={converting || loading || !amount}
            >
              {btnLabel}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}