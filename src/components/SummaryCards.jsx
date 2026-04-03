import React from "react";
import { Plus } from "lucide-react";

/* small decorative cloud puff used inside cards */
function MiniCloud({ style }) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", pointerEvents: "none", ...style }}>
      <svg viewBox="0 0 200 70" xmlns="http://www.w3.org/2000/svg"
        width="100%" height="100%">
        <ellipse cx="100" cy="60" rx="96"  ry="18"  fill="white" opacity="0.50" />
        <circle  cx="28"  cy="50" r="18"             fill="white" opacity="0.48" />
        <circle  cx="62"  cy="38" r="26"             fill="white" opacity="0.52" />
        <circle  cx="100" cy="28" r="32"             fill="white" opacity="0.55" />
        <circle  cx="140" cy="36" r="26"             fill="white" opacity="0.52" />
        <circle  cx="172" cy="48" r="20"             fill="white" opacity="0.48" />
        <ellipse cx="98"  cy="18" rx="22"  ry="9"    fill="white" opacity="0.20" />
      </svg>
    </div>
  );
}

function SummaryCards({ balance, income, expense }) {
  return (
    <div className="grid grid-cols-12 gap-6 mb-10">

      {/* ── Total Balance ── */}
      <div
        className="col-span-12 h-40 p-6 rounded-3xl relative overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.42)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.70)",
          boxShadow:
            "0 2px 4px rgba(14,165,233,0.06), 0 12px 40px rgba(14,165,233,0.14), inset 0 1px 0 rgba(255,255,255,0.80)",
        }}
      >
        {/* decorative cloud puff — bottom right */}
        <MiniCloud style={{ bottom: "-10px", right: "-20px", width: "180px", height: "70px", opacity: 0.7 }} />
        <MiniCloud style={{ bottom: "-14px", left: "30%",    width: "140px", height: "55px", opacity: 0.5 }} />

        {/* horizon wash */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "45%",
          background: "linear-gradient(to top, rgba(186,230,253,0.30), transparent)",
          pointerEvents: "none",
        }} />

        {/* sparkline */}
        <svg className="absolute bottom-0 left-0 w-full h-20" style={{ opacity: 0.20 }}>
          <polyline fill="none" stroke="#0ea5e9" strokeWidth="2"
            points="0,50 40,30 80,40 120,20 160,30 200,10" />
        </svg>

        <p style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.10em", color: "#475569", position: "relative", zIndex: 2 }}>
          TOTAL BALANCE
        </p>
        <h2 style={{ fontSize: "32px", fontFamily: "monospace", fontVariantNumeric: "tabular-nums", marginTop: "8px", color: "#0c4a6e", fontWeight: 700, position: "relative", zIndex: 2 }}>
          ₹{balance}
        </h2>

        <button
          className="absolute top-4 right-4 p-2 rounded-full"
          style={{ background: "rgba(186,230,253,0.50)", border: "1px solid rgba(125,211,252,0.40)", cursor: "pointer", zIndex: 2 }}
        >
          <Plus size={16} color="#0284c7" />
        </button>
      </div>

      {/* ── Income ── */}
      <div
        className="col-span-6 h-40 p-6 rounded-3xl relative overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.42)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.70)",
          boxShadow:
            "0 2px 4px rgba(16,185,129,0.06), 0 12px 40px rgba(16,185,129,0.12), inset 0 1px 0 rgba(255,255,255,0.80)",
        }}
      >
        <MiniCloud style={{ bottom: "-8px", right: "-10px", width: "150px", height: "58px", opacity: 0.65 }} />

        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "45%",
          background: "linear-gradient(to top, rgba(167,243,208,0.30), transparent)",
          pointerEvents: "none",
        }} />

        <svg className="absolute bottom-0 left-0 w-full h-20" style={{ opacity: 0.20 }}>
          <polyline fill="none" stroke="#10b981" strokeWidth="2"
            points="0,60 40,50 80,30 120,20 160,15 200,10" />
        </svg>

        <p style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.10em", color: "#475569", position: "relative", zIndex: 2 }}>
          INCOME
        </p>
        <h2 style={{ fontSize: "24px", fontFamily: "monospace", fontWeight: 800, fontVariantNumeric: "tabular-nums", marginTop: "8px", color: "#047857", position: "relative", zIndex: 2 }}>
          + ₹{income}
        </h2>

        <button
          className="absolute top-4 right-4 p-2 rounded-full"
          style={{ background: "rgba(167,243,208,0.50)", border: "1px solid rgba(110,231,183,0.40)", cursor: "pointer", zIndex: 2 }}
        >
          <Plus size={16} color="#10b981" />
        </button>
      </div>

      {/* ── Expenses ── */}
      <div
        className="col-span-6 h-40 p-6 rounded-3xl relative overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.42)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.70)",
          boxShadow:
            "0 2px 4px rgba(239,68,68,0.06), 0 12px 40px rgba(239,68,68,0.10), inset 0 1px 0 rgba(255,255,255,0.80)",
        }}
      >
        <MiniCloud style={{ bottom: "-8px", right: "-10px", width: "150px", height: "58px", opacity: 0.65 }} />

        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "45%",
          background: "linear-gradient(to top, rgba(254,202,202,0.28), transparent)",
          pointerEvents: "none",
        }} />

        <svg className="absolute bottom-0 left-0 w-full h-20" style={{ opacity: 0.20 }}>
          <polyline fill="none" stroke="#ef4444" strokeWidth="2"
            points="0,10 40,20 80,40 120,50 160,60 200,70" />
        </svg>

        <p style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.10em", color: "#475569", position: "relative", zIndex: 2 }}>
          EXPENSES
        </p>
        <h2 style={{ fontSize: "24px", fontFamily: "monospace", fontVariantNumeric: "tabular-nums", marginTop: "8px", color: "#dc2626", position: "relative", zIndex: 2 }}>
          - ₹{expense}
        </h2>

        <button
          className="absolute top-4 right-4 p-2 rounded-full"
          style={{ background: "rgba(254,202,202,0.50)", border: "1px solid rgba(252,165,165,0.40)", cursor: "pointer", zIndex: 2 }}
        >
          <Plus size={16} color="#ef4444" />
        </button>
      </div>

    </div>
  );
}

export default SummaryCards;
