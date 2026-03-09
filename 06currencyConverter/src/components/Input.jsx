import { useState, useRef, useEffect } from "react";

const CURRENCY_META = {
  USD: { symbol: "$",    flag: "🇺🇸", name: "US Dollar"       },
  EUR: { symbol: "€",    flag: "🇪🇺", name: "Euro"             },
  GBP: { symbol: "£",    flag: "🇬🇧", name: "British Pound"    },
  INR: { symbol: "₹",    flag: "🇮🇳", name: "Indian Rupee"     },
  JPY: { symbol: "¥",    flag: "🇯🇵", name: "Japanese Yen"     },
  AED: { symbol: "د.إ",  flag: "🇦🇪", name: "UAE Dirham"       },
  CAD: { symbol: "C$",   flag: "🇨🇦", name: "Canadian Dollar"  },
  SGD: { symbol: "S$",   flag: "🇸🇬", name: "Singapore Dollar" },
  CHF: { symbol: "Fr",   flag: "🇨🇭", name: "Swiss Franc"      },
  AUD: { symbol: "A$",   flag: "🇦🇺", name: "Aus Dollar"       },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@300;400;500&display=swap');

  /* ── Card ── */
  .ib {
    position: relative;
    background: #EDF1D6;
    border-radius: 22px;
    padding: 18px 20px 16px;
    border: 2px solid transparent;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.25s ease;
    cursor: text;
    overflow: visible;
    user-select: none;
  }
  .ib:hover:not(.ib--readonly) {
    transform: translateY(-2px);
    box-shadow: 0 10px 36px rgba(64,81,59,0.13);
  }
  .ib--focused {
    border-color: #609966 !important;
    box-shadow: 0 0 0 5px rgba(96,153,102,0.16), 0 10px 36px rgba(64,81,59,0.1) !important;
    transform: translateY(-3px) !important;
  }
  .ib--readonly { cursor: default; }
  .ib--readonly:hover { transform: none !important; box-shadow: none !important; }

  /* shimmer sweep on focus */
  .ib::before {
    content: '';
    position: absolute; inset: 0;
    border-radius: 22px;
    background: linear-gradient(110deg, transparent 25%, rgba(157,192,139,0.14) 50%, transparent 75%);
    background-size: 200% 100%;
    background-position: 200% 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .ib--focused::before {
    opacity: 1;
    animation: ibSweep 2.4s ease-in-out infinite;
  }
  @keyframes ibSweep {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Top row: label + balance ── */
  .ib__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .ib__label {
    display: flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: #609966;
    transition: color 0.3s ease;
  }
  .ib--focused .ib__label { color: #40513B; }

  .ib__dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #9DC08B; flex-shrink: 0;
    transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
  }
  .ib--focused .ib__dot {
    background: #609966;
    transform: scale(1.8);
    box-shadow: 0 0 0 3px rgba(96,153,102,0.2);
  }

  .ib__symbol-badge {
    font-family: 'DM Mono', monospace;
    font-size: 11px; font-weight: 500;
    color: #9DC08B;
    background: rgba(64,81,59,0.08);
    padding: 2px 8px; border-radius: 20px;
    letter-spacing: 0.04em;
    transition: all 0.3s ease;
  }
  .ib--focused .ib__symbol-badge {
    background: rgba(96,153,102,0.15);
    color: #40513B;
  }

  /* ── Middle: amount input ── */
  .ib__mid {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 14px;
  }
  .ib__amount {
    font-family: 'DM Mono', monospace;
    font-size: 38px; font-weight: 300;
    color: #40513B; background: transparent;
    border: none; outline: none; width: 100%;
    letter-spacing: -0.04em;
    -moz-appearance: textfield;
    transition: color 0.3s ease, opacity 0.3s ease;
  }
  .ib__amount::-webkit-inner-spin-button,
  .ib__amount::-webkit-outer-spin-button { -webkit-appearance: none; }
  .ib__amount::placeholder { color: #9DC08B; opacity: 0.5; font-weight: 300; }
  .ib__amount:disabled { cursor: default; }

  /* typing pulse on the amount */
  .ib__amount--typing { animation: ibAmountPop 0.15s ease; }
  @keyframes ibAmountPop {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.018); }
    100% { transform: scale(1); }
  }

  /* ── Currency pill ── */
  .ib__pill {
    display: flex; align-items: center; gap: 7px;
    background: #40513B; color: #EDF1D6;
    border: none; border-radius: 14px;
    padding: 10px 13px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600; font-size: 13px;
    letter-spacing: 0.04em; white-space: nowrap;
    flex-shrink: 0; position: relative; overflow: hidden;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1),
                box-shadow 0.25s ease;
  }
  /* fill reveal on hover */
  .ib__pill::after {
    content: ''; position: absolute; inset: 0;
    background: #609966;
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.28s ease; z-index: 0;
    border-radius: 14px;
  }
  .ib__pill:not(:disabled):hover::after { transform: scaleX(1); }
  .ib__pill > * { position: relative; z-index: 1; }
  .ib__pill:not(:disabled):hover {
    transform: scale(1.06);
    box-shadow: 0 5px 18px rgba(64,81,59,0.3);
  }
  .ib__pill:not(:disabled):active { transform: scale(0.95); }
  .ib__pill:disabled { cursor: default; opacity: 0.85; }

  .ib__chevron {
    font-size: 8px; opacity: 0.55;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
    display: inline-block;
  }
  .ib__chevron--open { transform: rotate(180deg); }

  /* ── Bottom row: currency name + formatted amount ── */
  .ib__bottom {
    display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid rgba(64,81,59,0.1);
    padding-top: 10px;
    min-height: 24px;
  }
  .ib__currency-name {
    font-size: 11px; font-weight: 500;
    color: #9DC08B; letter-spacing: 0.02em;
    transition: color 0.3s ease;
  }
  .ib--focused .ib__currency-name { color: #609966; }

  .ib__formatted {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: #609966; opacity: 0.7;
    transition: opacity 0.3s ease;
    letter-spacing: 0.02em;
  }
  .ib--focused .ib__formatted { opacity: 1; }

  /* ── Dropdown ── */
  .ib__dropdown-wrap { position: relative; }

  .ib__dropdown {
    position: absolute;
    top: calc(100% + 10px); right: 0;
    background: #EDF1D6;
    border: 1.5px solid rgba(96,153,102,0.5);
    border-radius: 18px; padding: 8px;
    min-width: 220px; z-index: 999;
    box-shadow: 0 20px 60px rgba(64,81,59,0.22);
    animation: ibDropIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both;
    transform-origin: top right;
    max-height: 280px; overflow-y: auto;
  }
  .ib__dropdown::-webkit-scrollbar { width: 4px; }
  .ib__dropdown::-webkit-scrollbar-track { background: transparent; }
  .ib__dropdown::-webkit-scrollbar-thumb { background: #9DC08B; border-radius: 4px; }

  @keyframes ibDropIn {
    from { opacity: 0; transform: scale(0.84) translateY(-8px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);    }
  }

  .ib__search {
    width: 100%; padding: 8px 12px; margin-bottom: 6px;
    background: rgba(64,81,59,0.07);
    border: 1.5px solid transparent; border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500; color: #40513B;
    outline: none;
    transition: border-color 0.2s ease, background 0.2s ease;
  }
  .ib__search:focus {
    border-color: #609966;
    background: rgba(96,153,102,0.08);
  }
  .ib__search::placeholder { color: #9DC08B; opacity: 0.7; }

  .ib__option {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 11px;
    cursor: pointer; font-size: 13px; font-weight: 500;
    color: #40513B;
    transition: background 0.15s ease, transform 0.15s ease;
  }
  .ib__option:hover { background: rgba(64,81,59,0.08); transform: translateX(3px); }
  .ib__option--active { background: #40513B; color: #EDF1D6; }
  .ib__option--active:hover { background: #40513B; }

  .ib__option-name {
    font-size: 11px; color: #609966; font-weight: 400;
    flex: 1;
  }
  .ib__option--active .ib__option-name { color: #9DC08B; }

  .ib__option-sym {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: #609966; opacity: 0.75; margin-left: auto;
  }
  .ib__option--active .ib__option-sym { color: #9DC08B; }

  .ib__no-results {
    text-align: center; padding: 12px;
    font-size: 12px; color: #9DC08B; opacity: 0.7;
  }
`;

// Formats number nicely: 1234567 → 1,234,567.00
function formatAmount(val, code) {
  if (!val && val !== 0) return "";
  const num = parseFloat(val);
  if (isNaN(num)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(num);
}

/**
 * InputBox — drop-in component for currency converter
 *
 * Props:
 *   label            string
 *   amount           number | string
 *   onAmountChange   fn(number)  — omit to make amount read-only
 *   currencyValue    string      — e.g. "USD"
 *   onCurrencyChange fn(string)  — omit to lock currency pill
 *   selectList       string[]    — currency codes to show in dropdown
 */
function InputBox({
  label = "Amount",
  amount = "",
  onAmountChange,
  currencyValue = "USD",
  onCurrencyChange,
  selectList = Object.keys(CURRENCY_META),
}) {
  const [focused,    setFocused]    = useState(false);
  const [open,       setOpen]       = useState(false);
  const [search,     setSearch]     = useState("");
  const [typing,     setTyping]     = useState(false);
  const inputRef  = useRef(null);
  const dropRef   = useRef(null);
  const searchRef = useRef(null);

  const isReadOnly = !onAmountChange;
  const meta = CURRENCY_META[currencyValue] || { symbol: currencyValue, flag: "🌐", name: currencyValue };

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Auto-focus search when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 80);
  }, [open]);

  // Typing animation pulse
  const handleAmountChange = (e) => {
    onAmountChange?.(Number(e.target.value));
    setTyping(true);
    setTimeout(() => setTyping(false), 150);
  };

  const filtered = selectList.filter(code => {
    const m = CURRENCY_META[code];
    if (!m) return false;
    const q = search.toLowerCase();
    return code.toLowerCase().includes(q) || m.name.toLowerCase().includes(q);
  });

  const classes = [
    "ib",
    focused   ? "ib--focused"  : "",
    isReadOnly ? "ib--readonly" : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      <style>{CSS}</style>

      <div className={classes} onClick={() => !isReadOnly && inputRef.current?.focus()}>

        {/* Top row */}
        <div className="ib__top">
          <div className="ib__label">
            <span className="ib__dot" />
            {label}
          </div>
          <span className="ib__symbol-badge">{meta.symbol} {currencyValue}</span>
        </div>

        {/* Amount + pill */}
        <div className="ib__mid">
          <input
            ref={inputRef}
            className={`ib__amount ${typing ? "ib__amount--typing" : ""}`}
            type="number"
            placeholder="0.00"
            value={amount}
            disabled={isReadOnly}
            onChange={handleAmountChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />

          <div className="ib__dropdown-wrap" ref={dropRef}>
            <button
              className="ib__pill"
              disabled={!onCurrencyChange}
              onMouseDown={e => e.preventDefault()}
              onClick={e => {
                e.stopPropagation();
                if (onCurrencyChange) {
                  setOpen(p => !p);
                  setSearch("");
                }
              }}
            >
              <span>{meta.flag}</span>
              <span>{currencyValue}</span>
              {onCurrencyChange && (
                <span className={`ib__chevron ${open ? "ib__chevron--open" : ""}`}>▼</span>
              )}
            </button>

            {open && onCurrencyChange && (
              <div className="ib__dropdown">
                <input
                  ref={searchRef}
                  className="ib__search"
                  placeholder="Search currency…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onMouseDown={e => e.stopPropagation()}
                />
                {filtered.length === 0 ? (
                  <div className="ib__no-results">No results for "{search}"</div>
                ) : (
                  filtered.map(code => {
                    const m = CURRENCY_META[code];
                    return (
                      <div
                        key={code}
                        className={`ib__option ${code === currencyValue ? "ib__option--active" : ""}`}
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => {
                          onCurrencyChange(code);
                          setOpen(false);
                          setSearch("");
                        }}
                      >
                        <span>{m.flag}</span>
                        <span>{code}</span>
                        <span className="ib__option-name">{m.name}</span>
                        <span className="ib__option-sym">{m.symbol}</span>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="ib__bottom">
          <span className="ib__currency-name">{meta.name}</span>
          {amount !== "" && amount !== 0 && (
            <span className="ib__formatted">
              {formatAmount(amount, currencyValue)}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default InputBox;