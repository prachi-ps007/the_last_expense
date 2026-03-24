
import React, { useEffect, useState, useCallback, useContext } from "react";
import { Rocket, ArrowLeftRight, RefreshCw } from "lucide-react";
import { FinanceContext } from "../context/FinanceContext";

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "JPY", "AED", "SGD", "CAD", "AUD", "CHF", "CNY"];

const QUICK_PAIRS = [
  { from: "USD", to: "INR" },
  { from: "EUR", to: "INR" },
  { from: "GBP", to: "INR" },
  { from: "INR", to: "USD" },
  { from: "AED", to: "INR" },
];

function CurrencyConverter() {
  const [fromCur, setFromCur] = useState("INR");
  const [toCur, setToCur] = useState("USD");
  const [fromAmt, setFromAmt] = useState("1000");
  const [toAmt, setToAmt] = useState("");
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAndConvert = useCallback(async (from, to, amount) => {
    if (from === to) {
      setToAmt(parseFloat(amount || 0).toFixed(2));
      setRate(1);
      setLastUpdated(new Date());
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
      const data = await res.json();
      const r = data.rates[to];
      setRate(r);
      setToAmt((parseFloat(amount || 0) * r).toFixed(2));
      setLastUpdated(new Date());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndConvert(fromCur, toCur, fromAmt);
  }, [fromCur, toCur]);

  const handleFromAmt = (val) => {
    setFromAmt(val);
    if (rate !== null && val) {
      setToAmt((parseFloat(val) * rate).toFixed(2));
    }
  };

  const handleSwap = () => {
    setFromCur(toCur);
    setToCur(fromCur);
    setFromAmt(toAmt || "1000");
  };

  const handleQuick = (from, to) => {
    setFromCur(from);
    setToCur(to);
    setFromAmt("1000");
  };

  const rateDisplay = rate !== null
    ? (rate < 1 ? rate.toFixed(6) : rate.toFixed(4))
    : "—";

  return (
    <div
      className="p-6 rounded-3xl backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(212,175,55,0.1)] flex flex-col h-full"
      style={{ background: "rgba(255,255,255,0.04)", minWidth: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm tracking-[0.3em] text-[#D4AF37]/80 uppercase">
          Currency Converter
        </h2>
        <button
          onClick={() => fetchAndConvert(fromCur, toCur, fromAmt)}
          className="text-white/30 hover:text-[#D4AF37] transition-colors"
          title="Refresh rate"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* From Row */}
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-2 border transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <input
          type="number"
          value={fromAmt}
          onChange={(e) => handleFromAmt(e.target.value)}
          className="bg-transparent border-none outline-none text-white font-mono text-xl font-bold w-full min-w-0"
          placeholder="0"
          style={{ fontFamily: "Space Mono, monospace" }}
        />
        <select
          value={fromCur}
          onChange={(e) => setFromCur(e.target.value)}
          className="text-white text-xs font-bold rounded-lg px-2 py-1 outline-none cursor-pointer tracking-wider"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            fontFamily: "Space Mono, monospace",
            minWidth: 68,
          }}
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c} style={{ background: "#0d1a30" }}>{c}</option>
          ))}
        </select>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center my-2">
        <button
          onClick={handleSwap}
          className="flex items-center justify-center rounded-full w-8 h-8 transition-all duration-300 hover:rotate-180"
          style={{
            background: "rgba(212,175,55,0.12)",
            border: "1px solid rgba(212,175,55,0.3)",
            color: "#D4AF37",
          }}
        >
          <ArrowLeftRight size={14} />
        </button>
      </div>

      {/* To Row */}
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-3 border"
        style={{
          background: "rgba(255,255,255,0.02)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <input
          type="number"
          value={toAmt}
          readOnly
          className="bg-transparent border-none outline-none font-mono text-xl font-bold w-full min-w-0"
          style={{ color: "rgba(232,224,208,0.6)", fontFamily: "Space Mono, monospace", cursor: "default" }}
          placeholder="—"
        />
        <select
          value={toCur}
          onChange={(e) => setToCur(e.target.value)}
          className="text-white text-xs font-bold rounded-lg px-2 py-1 outline-none cursor-pointer tracking-wider"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            fontFamily: "Space Mono, monospace",
            minWidth: 68,
          }}
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c} style={{ background: "#0d1a30" }}>{c}</option>
          ))}
        </select>
      </div>

      {/* Rate Display */}
      <div
        className="text-center py-2.5 px-3 rounded-xl mb-3"
        style={{
          background: "rgba(212,175,55,0.07)",
          border: "1px solid rgba(212,175,55,0.18)",
        }}
      >
        {loading ? (
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-xs text-red-400" style={{ fontFamily: "Space Mono, monospace" }}>
            CONNECTION ERROR
          </p>
        ) : (
          <>
            <p
              className="text-[#D4AF37] font-bold text-base"
              style={{ fontFamily: "Space Mono, monospace" }}
            >
              {rateDisplay}
            </p>
            <p className="text-white/30 text-[10px] tracking-widest mt-0.5" style={{ fontFamily: "Space Mono, monospace" }}>
              1 {fromCur} = {rateDisplay} {toCur} · LIVE
            </p>
            {lastUpdated && (
              <p className="text-white/20 text-[9px] mt-0.5">
                {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </>
        )}
      </div>

      {/* Quick Pair Chips */}
      <div className="mt-auto pt-3 flex flex-wrap gap-1.5">
        {QUICK_PAIRS.map(({ from, to }) => (
          <button
            key={`${from}-${to}`}
            onClick={() => handleQuick(from, to)}
            className="text-[10px] tracking-wide rounded-full px-2.5 py-1 transition-all duration-200"
            style={{
              fontFamily: "Space Mono, monospace",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(232,224,208,0.45)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(212,175,55,0.12)";
              e.currentTarget.style.color = "#D4AF37";
              e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.color = "rgba(232,224,208,0.45)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
            {from} → {to}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── WEALTH VELOCITY CALCULATIONS ─────────────────────────────────────────────
//
// velocity  = net savings per day (income - expense) over the current month
//             so if you spend more than you earn, this goes negative
//
// progress  = (totalIncome - totalExpense) / totalIncome × 100
//             clamped to [0, 100]; represents how much of income is being saved
//
// monthlyTarget = totalIncome for the current month (your ceiling)
//
// thisMonth = net amount saved this month (income - expense)
//
// savingsRate = (totalIncome - totalExpense) / totalIncome × 100
//               clamped to 0 if in deficit
//
function computeVelocity(transactions) {
  const now       = new Date();
  const thisMonth = now.getMonth();
  const thisYear  = now.getFullYear();
  const dayOfMonth = now.getDate(); // days elapsed so far this month

  // Filter to current month only
  const monthTxns = transactions.filter((txn) => {
    const d = new Date(txn.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const monthIncome  = monthTxns
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);

  const monthExpense = monthTxns
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);

  const netSaved      = monthIncome - monthExpense;
  // Daily velocity: net rupees saved per day so far this month
  const velocity      = dayOfMonth > 0 ? Math.round(netSaved / dayOfMonth) : 0;

  // Progress ring: what % of income is net-saved (0–100)
  const progress      = monthIncome > 0
    ? Math.max(0, Math.min(100, Math.round((netSaved / monthIncome) * 100)))
    : 0;

  // Savings rate (same as progress here, kept named separately for the card)
  const savingsRate   = progress;

  // Format helpers
  const fmt = (n) => {
    const abs = Math.abs(n);
    if (abs >= 100000) return `${(n / 100000).toFixed(1)}L`;
    if (abs >= 1000)   return `${(n / 1000).toFixed(1)}K`;
    return String(n);
  };

  return {
    velocity,          // ₹/day — can be negative
    progress,          // 0–100
    savingsRate,       // 0–100
    thisMonth: netSaved,
    monthlyTarget: monthIncome, // income is the ceiling
    fmt,
  };
}

function Dashboard() {
  // ── Pull live data from context ──────────────────────────────────────────
  const { transactions, totalIncome, totalExpense, balance } =
    useContext(FinanceContext);

  const { velocity, progress, savingsRate, thisMonth, monthlyTarget, fmt } =
    computeVelocity(transactions);

  // ── Typewriter (unchanged) ───────────────────────────────────────────────
  const fullText = "!A Penny Saved Is A Penny Earned!";
  const [text, setText] = useState("");

  useEffect(() => {
    let index = 0;
    const startTyping = () => {
      const interval = setInterval(() => {
        setText(fullText.slice(0, index + 1));
        index++;
        if (index === fullText.length) clearInterval(interval);
      }, 80);
    };
    const delay = setTimeout(startTyping, 500);
    return () => clearTimeout(delay);
  }, []);

  // Ring colour: green when saving, amber when breaking even, red when deficit
  const ringColor = progress > 30
    ? "#D4AF37"
    : progress > 0
    ? "#F59E0B"
    : "#EF4444";

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-black via-slate-950 to-black relative overflow-hidden">

      {/* Starfield */}
      <div className="absolute inset-0">
        {[...Array(80)].map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
            }}
          />
        ))}
      </div>

      {/* Typewriter Hero */}
      <div className="flex justify-center items-center min-h-[45vh] relative z-10 px-4">
        <h2
          style={{ fontFamily: "Amatic SC, cursive" }}
          className="text-4xl md:text-7xl font-extrabold text-center tracking-[0.3em] text-slate-200"
        >
          {text}
          <span className="animate-blink">|</span>
        </h2>
      </div>

      {/* Widgets Row */}
      <div className="relative z-10 px-70 pb-16">
        <div className="max-w-9xl mx-auto grid grid-cols-2 md:grid-cols-2 gap-12 items-stretch">

          {/* ── Wealth Velocity ── */}
          <div
            className="p-8 rounded-3xl backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(212,175,55,0.15)] flex flex-col justify-between"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <h2 className="text-center font-extrabold text-sm tracking-[0.3em] text-[#D4AF37]/80 uppercase mb-6">
              Wealth Velocity
            </h2>

            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-52 h-52">
                <svg className="w-full h-full rotate-[-90deg]">
                  {/* Track */}
                  <circle
                    cx="104" cy="104" r="90"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  {/* Progress ring — driven by real data */}
                  <circle
                    cx="104" cy="104" r="90"
                    stroke={ringColor}
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 90}
                    strokeDashoffset={(2 * Math.PI * 90) * (1 - progress / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                    style={{ filter: `drop-shadow(0 0 10px ${ringColor}99)` }}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-2 mb-2">
                    <Rocket
                      size={18}
                      className="animate-pulse"
                      style={{ color: ringColor }}
                    />
                    <span className="text-xs text-white/50 tracking-wide">Momentum</span>
                  </div>
                  {/* Velocity — red & prefixed with − if deficit */}
                  <p
                    className="text-3xl font-light"
                    style={{ color: velocity >= 0 ? "#fff" : "#EF4444" }}
                  >
                    {velocity < 0 ? "−" : ""}₹{fmt(Math.abs(velocity))}/day
                  </p>
                  <p className="text-xs text-white/50 mt-1">
                    {progress}% of monthly target
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom stats — all from real context data */}
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              {[
                {
                  label: "Savings Rate",
                  value: `${savingsRate}%`,
                  warn: savingsRate <= 0,
                },
                {
                  label: "This Month",
                  // Net saved (income − expense); red if negative
                  value: `${thisMonth < 0 ? "−" : ""}₹${fmt(Math.abs(thisMonth))}`,
                  warn: thisMonth < 0,
                },
                {
                  label: "Income",
                  value: `₹${fmt(monthlyTarget)}`,
                  warn: false,
                },
              ].map(({ label, value, warn }) => (
                <div
                  key={label}
                  className="rounded-xl py-2 px-1"
                  style={{
                    background: warn
                      ? "rgba(239,68,68,0.08)"
                      : "rgba(212,175,55,0.06)",
                    border: warn
                      ? "1px solid rgba(239,68,68,0.2)"
                      : "1px solid rgba(212,175,55,0.12)",
                  }}
                >
                  <p
                    className="font-bold text-sm"
                    style={{
                      fontFamily: "Space Mono, monospace",
                      color: warn ? "#EF4444" : "#D4AF37",
                    }}
                  >
                    {value}
                  </p>
                  <p className="text-white/30 text-[9px] tracking-wide mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Currency Converter — unchanged */}
          <CurrencyConverter />

        </div>
      </div>

    </div>
  );
}

export default Dashboard;

/*
  index.css additions (if not already present):

  .star {
    position: absolute;
    background: white;
    border-radius: 50%;
    opacity: 0.8;
    animation: twinkle 3s infinite ease-in-out;
  }
  @keyframes twinkle {
    0%, 100% { opacity: 0.2; }
    50%       { opacity: 1;   }
  }
  .animate-blink { animation: blink 1s step-end infinite; }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
*/

