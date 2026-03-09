import { useState, useRef } from "react";

const currencies = [
  { code: "USD", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", flag: "🇬🇧" },
  { code: "INR", symbol: "₹", flag: "🇮🇳" },
  { code: "JPY", symbol: "¥", flag: "🇯🇵" },
];

function InputBox({ label = "You Send", value, onChange, currency, onCurrencyChange }) {
  const [focused, setFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef(null);

  const selected = currencies.find((c) => c.code === currency) || currencies[0];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap');

        .ib-wrapper {
          font-family: 'DM Sans', sans-serif;
          position: relative;
        }

        .ib-card {
          position: relative;
          background: #EDF1D6;
          border-radius: 20px;
          padding: 20px 22px;
          border: 2px solid transparent;
          transition: border-color 0.35s ease, box-shadow 0.35s ease, transform 0.2s ease;
          cursor: text;
          overflow: visible;
        }

        .ib-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(64,81,59,0.12);
        }

        .ib-card.focused {
          border-color: #609966;
          box-shadow: 0 0 0 4px rgba(96,153,102,0.15), 0 8px 32px rgba(64,81,59,0.1);
          transform: translateY(-2px);
        }

        .ib-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #609966;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.3s ease;
        }

        .ib-card.focused .ib-label {
          color: #40513B;
        }

        .ib-label-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #9DC08B;
          display: inline-block;
          transition: background 0.3s ease, transform 0.3s ease;
        }

        .ib-card.focused .ib-label-dot {
          background: #609966;
          transform: scale(1.4);
        }

        .ib-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .ib-amount {
          font-family: 'DM Mono', monospace;
          font-size: 32px;
          font-weight: 400;
          color: #40513B;
          background: transparent;
          border: none;
          outline: none;
          width: 100%;
          letter-spacing: -0.02em;
          transition: color 0.3s ease;
        }

        .ib-amount::placeholder {
          color: #9DC08B;
          font-weight: 300;
        }

        .ib-amount::-webkit-inner-spin-button,
        .ib-amount::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .ib-currency-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #40513B;
          color: #EDF1D6;
          border: none;
          border-radius: 12px;
          padding: 10px 14px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.04em;
          white-space: nowrap;
          transition: background 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease;
          flex-shrink: 0;
        }

        .ib-currency-btn:hover {
          background: #609966;
          transform: scale(1.03);
          box-shadow: 0 4px 14px rgba(64,81,59,0.25);
        }

        .ib-currency-btn:active {
          transform: scale(0.97);
        }

        .ib-chevron {
          font-size: 10px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          opacity: 0.7;
        }

        .ib-chevron.open {
          transform: rotate(180deg);
        }

        /* Dropdown */
        .ib-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: #EDF1D6;
          border: 1.5px solid #9DC08B;
          border-radius: 16px;
          padding: 8px;
          min-width: 180px;
          z-index: 100;
          box-shadow: 0 16px 48px rgba(64,81,59,0.18);
          animation: dropIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transform-origin: top right;
        }

        @keyframes dropIn {
          from {
            opacity: 0;
            transform: scale(0.88) translateY(-8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .ib-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #40513B;
          transition: background 0.18s ease, transform 0.15s ease;
        }

        .ib-option:hover {
          background: #9DC08B33;
          transform: translateX(3px);
        }

        .ib-option.active {
          background: #40513B;
          color: #EDF1D6;
        }

        .ib-option-symbol {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: #609966;
          margin-left: auto;
        }

        .ib-option.active .ib-option-symbol {
          color: #9DC08B;
        }

        /* Shimmer on focus */
        .ib-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: linear-gradient(120deg, transparent 30%, rgba(157,192,139,0.08) 50%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .ib-card.focused::after {
          opacity: 1;
          animation: shimmer 2.5s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <div className="ib-wrapper">
        <div
          className={`ib-card ${focused ? "focused" : ""}`}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="ib-label">
            <span className="ib-label-dot" />
            {label}
          </div>
          <div className="ib-body">
            <input
              ref={inputRef}
              className="ib-amount"
              type="number"
              placeholder="0.00"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => { setFocused(false); setDropdownOpen(false); }}
            />
            <button
              className="ib-currency-btn"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => { e.stopPropagation(); setDropdownOpen((p) => !p); }}
            >
              <span>{selected.flag}</span>
              <span>{selected.code}</span>
              <span className={`ib-chevron ${dropdownOpen ? "open" : ""}`}>▼</span>
            </button>
          </div>

          {dropdownOpen && (
            <div className="ib-dropdown">
              {currencies.map((c) => (
                <div
                  key={c.code}
                  className={`ib-option ${c.code === selected.code ? "active" : ""}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { onCurrencyChange?.(c.code); setDropdownOpen(false); }}
                >
                  <span>{c.flag}</span>
                  <span>{c.code}</span>
                  <span className="ib-option-symbol">{c.symbol}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default InputBox;