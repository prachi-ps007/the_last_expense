import React, { useContext, useState } from "react";
import { FinanceContext } from "../context/FinanceContext";
import SummaryCards from "../components/SummaryCards";
import FilterSection from "../components/FilterSection";
import useDebounce from "../hooks/useDebounce";
import { X } from "lucide-react";

/* ─── drifting cloud SVGs that float across the page background ─── */
function BackgroundCloud({ style, duration, size = 220 }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: "-300px",
        zIndex: 0,
        pointerEvents: "none",
        animation: `cloudDrift ${duration}s linear infinite`,
        ...style,
      }}
    >
      <svg
        viewBox="0 0 520 170"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={Math.round(size * 0.33)}
        aria-hidden="true"
      >
        <ellipse cx="260" cy="152" rx="245" ry="36"  fill="white" opacity="0.55" />
        <circle  cx="52"  cy="140" r="30"            fill="white" opacity="0.50" />
        <circle  cx="115" cy="120" r="52"            fill="white" opacity="0.55" />
        <circle  cx="180" cy="100" r="50"            fill="white" opacity="0.58" />
        <circle  cx="254" cy="70"  r="76"            fill="white" opacity="0.60" />
        <circle  cx="328" cy="100" r="50"            fill="white" opacity="0.58" />
        <circle  cx="392" cy="118" r="52"            fill="white" opacity="0.55" />
        <circle  cx="456" cy="138" r="34"            fill="white" opacity="0.50" />
        <ellipse cx="240" cy="50"  rx="56"  ry="20"  fill="white" opacity="0.18" />
      </svg>
    </div>
  );
}

function Transactions() {
  const {
    transactions,
    deleteTransaction,
    totalIncome,
    totalExpense,
    balance,
  } = useContext(FinanceContext);

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dateFilter, setDateFilter] = useState("all");

  const debouncedSearch = useDebounce(search);

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (txn.notes || "").toLowerCase().includes(debouncedSearch.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(txn.category);

    const txnDate = new Date(txn.date);
    const now = new Date();
    let matchesDate = true;

    if (dateFilter === "30days") {
      const last30 = new Date();
      last30.setDate(now.getDate() - 30);
      matchesDate = txnDate >= last30;
    }
    if (dateFilter === "month") {
      matchesDate =
        txnDate.getMonth() === now.getMonth() &&
        txnDate.getFullYear() === now.getFullYear();
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  return (
    <>
      {/* ── keyframe injection ── */}
      <style>{`
        @keyframes cloudDrift {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(100vw + 340px)); }
        }
      `}</style>

      {/* ── drifting background clouds ── */}
      <BackgroundCloud duration={38} size={260} style={{ top: "8%",  animationDelay: "0s"   }} />
      <BackgroundCloud duration={52} size={180} style={{ top: "22%", animationDelay: "-18s"  }} />
      <BackgroundCloud duration={44} size={320} style={{ top: "55%", animationDelay: "-9s"   }} />
      <BackgroundCloud duration={60} size={140} style={{ top: "70%", animationDelay: "-34s"  }} />
      <BackgroundCloud duration={35} size={200} style={{ top: "38%", animationDelay: "-26s"  }} />

      <div
        className="min-h-screen pt-24 px-6 text-slate-800"
        style={{
          position: "relative",
          zIndex: 1,
          background:
            "linear-gradient(170deg, #38bdf8 0%, #7dd3fc 35%, #bae6fd 65%, #e0f2fe 100%)",
        }}
      >
        {/* Summary */}
        <SummaryCards
          balance={balance}
          income={totalIncome}
          expense={totalExpense}
        />
        <br />

        {/* Filters */}
        <FilterSection
          search={search}
          setSearch={setSearch}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />

        {/* ── Transaction Table ── */}
        <div
          style={{
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.6)",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(14,165,233,0.10)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              padding: "12px 24px",
              borderBottom: "1px solid rgba(148,163,184,0.18)",
              background: "rgba(224,242,254,0.45)",
            }}
          >
            {["Merchant", "Category", "Date", "Amount"].map((h, i) => (
              <span
                key={h}
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#64748b",
                  textTransform: "uppercase",
                  textAlign: i === 3 ? "right" : "left",
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {filteredTransactions.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#94a3b8",
                padding: "40px 0",
                fontSize: "14px",
              }}
            >
              No transactions found
            </div>
          ) : (
            filteredTransactions.map((txn) => (
              <div
                key={txn.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  padding: "16px 24px",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(148,163,184,0.12)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(186,230,253,0.30)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span style={{ fontWeight: 500, color: "#1e293b" }}>
                  {txn.title}
                </span>

                {/* category pill */}
                <span>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 600,
                      background: "rgba(186,230,253,0.55)",
                      color: "#0369a1",
                      border: "1px solid rgba(125,211,252,0.40)",
                    }}
                  >
                    {txn.category}
                  </span>
                </span>

                <span style={{ color: "#64748b", fontSize: "13px" }}>
                  {new Date(txn.date).toLocaleDateString()}
                </span>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontVariantNumeric: "tabular-nums",
                      fontWeight: 600,
                      color: txn.type === "income" ? "#059669" : "#ef4444",
                    }}
                  >
                    {txn.type === "income" ? "+" : "-"} ₹{txn.amount}
                  </span>

                  <button
                    onClick={() => deleteTransaction(txn.id)}
                    style={{
                      padding: "4px",
                      borderRadius: "6px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      transition: "background 0.15s",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(254,202,202,0.60)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <X size={16} color="#94a3b8" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* bottom breathing room */}
        <div style={{ height: "48px" }} />
      </div>
    </>
  );
}

export default Transactions;
