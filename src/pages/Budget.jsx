import React, { useEffect, useRef, useState, useCallback, useContext } from "react";
import { Flower2 } from "lucide-react";
import { FinanceContext } from "../context/FinanceContext";

// ─── Constants ────────────────────────────────────────────────────────────────
const FLOWER_COUNT = 7;

const THEMES = {
  blooming: {
    skyFrom: "#38bdf8", skyTo: "#4338ca",
    groundFrom: "#14532d", groundTo: "#052e16",
    sunColor: "#FDD835", sunGlow: "rgba(253,216,53,0.5)",
    barGradient: "linear-gradient(90deg,#6EE7B7,#10B981)",
    horizonColor: "rgba(134,239,172,0.6)",
    horizonGlow: "0 0 18px 6px rgba(134,239,172,0.3)",
    label: "Thriving 🌸", labelColor: "#6EE7B7",
    flowerColors: ["#FACC15","#F472B6","#FB923C","#A78BFA","#34D399","#F87171","#60A5FA"],
    flowerGlow: true, hasSun: true, hasClouds: true, hasRain: false,
    glass: "rgba(255,255,255,0.13)", glassBorder: "rgba(255,255,255,0.25)",
    glassText: "rgba(255,255,255,0.9)", glassSubtext: "rgba(255,255,255,0.5)",
  },
  warning: {
    skyFrom: "#FCD34D", skyTo: "#C2410C",
    groundFrom: "#92400E", groundTo: "#1C0A00",
    sunColor: "#FB923C", sunGlow: "rgba(251,146,60,0.4)",
    barGradient: "linear-gradient(90deg,#FCD34D,#D97706)",
    horizonColor: "rgba(252,211,77,0.45)", horizonGlow: "none",
    label: "Caution 🍂", labelColor: "#FCD34D",
    flowerColors: Array(7).fill("#FDE68A"),
    flowerGlow: false, hasSun: true, hasClouds: true, hasRain: false,
    glass: "rgba(0,0,0,0.18)", glassBorder: "rgba(255,200,50,0.3)",
    glassText: "rgba(255,255,255,0.95)", glassSubtext: "rgba(255,230,120,0.7)",
  },
  storm: {
    skyFrom: "#475569", skyTo: "#0F172A",
    groundFrom: "#292524", groundTo: "#0C0A09",
    sunColor: null, sunGlow: null,
    barGradient: "linear-gradient(90deg,#FDA4AF,#F43F5E)",
    horizonColor: "rgba(100,116,139,0.2)", horizonGlow: "none",
    label: "Critical ⚡", labelColor: "#F87171",
    flowerColors: Array(7).fill("#64748B"),
    flowerGlow: false, hasSun: false, hasClouds: false, hasRain: true,
    glass: "rgba(0,0,0,0.3)", glassBorder: "rgba(148,163,184,0.2)",
    glassText: "rgba(255,255,255,0.85)", glassSubtext: "rgba(148,163,184,0.7)",
  },
  over: {
    skyFrom: "#1E293B", skyTo: "#000000",
    groundFrom: "#18181B", groundTo: "#000000",
    sunColor: null, sunGlow: null,
    barGradient: "linear-gradient(90deg,#4B5563,#1F2937)",
    horizonColor: "rgba(71,85,105,0.15)", horizonGlow: "none",
    label: "Overspent 🌧", labelColor: "#EF4444",
    flowerColors: Array(7).fill("#374151"),
    flowerGlow: false, hasSun: false, hasClouds: false, hasRain: true,
    glass: "rgba(0,0,0,0.4)", glassBorder: "rgba(71,85,105,0.2)",
    glassText: "rgba(255,255,255,0.7)", glassSubtext: "rgba(100,116,139,0.6)",
  },
};

// ─── Category icon + color map (matches FinanceContext categories) ─────────────
const CATEGORY_META = {
  Rent:          { icon: "⌂",  color: "#34D399", accent: "#10B981" },
  Utilities:     { icon: "⚡", color: "#60A5FA", accent: "#3B82F6" },
  Food:          { icon: "✦",  color: "#F472B6", accent: "#EC4899" },
  Travel:        { icon: "◈",  color: "#60A5FA", accent: "#3B82F6" },
  Health:        { icon: "❋",  color: "#6EE7B7", accent: "#10B981" },
  Shopping:      { icon: "✿",  color: "#FCD34D", accent: "#F59E0B" },
  Entertainment: { icon: "◉",  color: "#A78BFA", accent: "#8B5CF6" },
  Subscriptions: { icon: "♾",  color: "#FB923C", accent: "#EA580C" },
  Misc:          { icon: "◆",  color: "#94A3B8", accent: "#64748B" },
};

const GOALS = [
  { id: "laptop",   name: "New Laptop",   target: 80000, saved: 52000, color: "#34D399" },
  { id: "vacation", name: "Goa Trip",     target: 35000, saved: 12000, color: "#F472B6" },
  { id: "camera",   name: "Camera",       target: 45000, saved: 45000, color: "#FCD34D" },
];

const fmt = (n) => "₹" + Math.abs(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
const pct  = (s, b) => b > 0 ? Math.min((s / b) * 100, 100) : 0;

// ─── Glass panel wrapper ───────────────────────────────────────────────────────
function GlassPanel({ theme, children, style = {} }) {
  return (
    <div style={{
      backdropFilter: "blur(22px)",
      WebkitBackdropFilter: "blur(22px)",
      background: theme.glass,
      border: `1px solid ${theme.glassBorder}`,
      borderRadius: 22,
      boxShadow: "0 8px 40px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.08)",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── 1. PERENNIAL FLOWER SVG ──────────────────────────────────────────────────
function PerennialFlower({ percentage, color, size = 100 }) {
  const stage = percentage >= 100 ? 4 : percentage >= 70 ? 3 : percentage >= 40 ? 2 : percentage >= 20 ? 1 : 0;
  const cx = size / 2, cy = size / 2;
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow:"visible" }}>
      <ellipse cx={cx} cy={size - 8} rx={size * 0.3} ry={6} fill="rgba(255,255,255,0.15)" />
      {stage >= 1 && (
        <path d={`M${cx} ${size - 10} Q${cx - 7} ${cy + 8} ${cx} ${cy + 4}`}
          stroke="rgba(110,231,183,0.9)" strokeWidth={2.5} fill="none" strokeLinecap="round"
          style={{ strokeDasharray: 60, strokeDashoffset: mounted ? 0 : 60, transition: "stroke-dashoffset 0.9s ease" }}
        />
      )}
      {stage >= 1 && (
        <>
          <ellipse cx={cx - 10} cy={cy + 16} rx={8} ry={4} fill="rgba(110,231,183,0.7)"
            style={{ transform: `scale(${mounted ? 1 : 0})`, transformOrigin: `${cx}px ${cy + 16}px`, transition: "transform 0.5s 0.5s ease" }}
          />
          <ellipse cx={cx + 10} cy={cy + 18} rx={8} ry={4} fill="rgba(110,231,183,0.7)"
            style={{ transform: `scale(${mounted ? 1 : 0})`, transformOrigin: `${cx}px ${cy + 18}px`, transition: "transform 0.5s 0.6s ease" }}
          />
        </>
      )}
      {stage >= 2 && (
        <ellipse cx={cx} cy={cy - 2} rx={9} ry={12} fill={color} opacity={0.75}
          style={{ transform: `scale(${mounted ? 1 : 0})`, transformOrigin: `${cx}px ${cy}px`, transition: "transform 0.5s 0.3s ease" }}
        />
      )}
      {stage >= 3 && [0,60,120,180,240,300].map((deg, i) => (
        <ellipse key={deg}
          cx={cx + Math.cos((deg * Math.PI) / 180) * 14}
          cy={(cy - 3) + Math.sin((deg * Math.PI) / 180) * 14}
          rx={9} ry={5.5} fill={color} opacity={0.85}
          style={{
            transform: `scale(${mounted ? 1 : 0})`,
            transformOrigin: `${cx}px ${cy - 3}px`,
            transition: `transform 0.35s ${0.2 + i * 0.06}s ease`,
          }}
        />
      ))}
      {stage >= 3 && (
        <circle cx={cx} cy={cy - 3} r={9} fill="rgba(253,216,53,0.95)"
          style={{ transform: `scale(${mounted ? 1 : 0})`, transformOrigin: `${cx}px ${cy - 3}px`, transition: "transform 0.4s 0.55s ease" }}
        />
      )}
      {stage === 4 && [30,90,150,210,270,330].map((deg, i) => (
        <ellipse key={`o${deg}`}
          cx={cx + Math.cos((deg * Math.PI) / 180) * 22}
          cy={(cy - 3) + Math.sin((deg * Math.PI) / 180) * 22}
          rx={7} ry={4.5} fill={color} opacity={0.5}
          style={{ transform: `scale(${mounted ? 1 : 0})`, transformOrigin: `${cx}px ${cy - 3}px`, transition: `transform 0.35s ${0.65 + i * 0.06}s ease` }}
        />
      ))}
      {stage === 4 && [0,72,144,216,288].map((deg, i) => (
        <circle key={`sp${i}`}
          cx={cx + Math.cos((deg * Math.PI) / 180) * 36}
          cy={(cy - 3) + Math.sin((deg * Math.PI) / 180) * 36}
          r={2} fill="rgba(253,216,53,0.9)"
          style={{ animation: `goalSparkle 2s ${i * 0.4}s ease-in-out infinite` }}
        />
      ))}
      {stage === 0 && (
        <ellipse cx={cx} cy={size - 16} rx={7} ry={9} fill="rgba(255,255,255,0.35)"
          style={{ transform: `scale(${mounted ? 1 : 0})`, transformOrigin: `${cx}px ${size - 16}px`, transition: "transform 0.4s ease" }}
        />
      )}
    </svg>
  );
}

// ─── 2. SEASONAL BAR ─────────────────────────────────────────────────────────
function SeasonalBar({ d, isActive, onClick, glassText, glassSubtext }) {
  const [hov, setHov] = useState(false);
  const ratio = d.spent / d.budget;
  const sky   = ratio > 1.1 ? "#92400E" : ratio > 0.9 ? "#D97706" : ratio > 0.7 ? "#7DD3FC" : "#6EE7B7";
  const grass = ratio > 1.1 ? "#6B3A1F" : ratio > 0.9 ? "#92400E" : ratio > 0.7 ? "#16A34A" : "#059669";
  const flowers = ratio > 1.0 ? 0 : ratio > 0.85 ? 1 : ratio > 0.65 ? 3 : 5;
  const weeds   = d.impulse > 6 ? 3 : d.impulse > 3 ? 2 : 0;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: "0 0 62px",
        cursor: "pointer",
        transition: "transform 0.2s",
        transform: (hov || isActive) ? "translateY(-6px)" : "none",
      }}
    >
      <div style={{
        width: 62, height: 80, borderRadius: 10, overflow: "hidden",
        border: isActive ? "2px solid rgba(255,255,255,0.7)" : "1px solid rgba(255,255,255,0.2)",
        background: sky, position: "relative",
      }}>
        <svg width={62} height={80} viewBox="0 0 62 80" style={{ position:"absolute", inset:0 }}>
          <rect x={0} y={48} width={62} height={32} fill={grass} />
          <path d="M0 54 Q16 44 31 54 Q46 64 62 54 L62 80 L0 80Z" fill={grass} opacity={0.6} />
          {Array.from({ length: flowers }).map((_, fi) => {
            const fx = 6 + fi * 12;
            return (
              <g key={fi}>
                <line x1={fx} y1={58} x2={fx} y2={48} stroke="#4ADE80" strokeWidth={1.2} />
                <circle cx={fx} cy={46} r={3.5} fill={["#FACC15","#F472B6","#FB923C","#A78BFA","#34D399"][fi % 5]} />
              </g>
            );
          })}
          {Array.from({ length: weeds }).map((_, wi) => {
            const wx = 10 + wi * 22;
            return (
              <g key={wi}>
                <path d={`M${wx} 58 Q${wx-5} 50 ${wx-7} 46`} stroke="#6B7280" strokeWidth={1.3} fill="none"/>
                <path d={`M${wx} 58 Q${wx+5} 50 ${wx+7} 46`} stroke="#6B7280" strokeWidth={1.3} fill="none"/>
              </g>
            );
          })}
          {ratio > 1.0 && <rect x={0} y={0} width={62} height={80} fill="rgba(148,163,184,0.25)" />}
        </svg>
        {d.impulse > 3 && (
          <div style={{
            position:"absolute", top:3, right:3,
            background:"rgba(0,0,0,0.55)", color:"#FCD34D",
            fontSize:8, fontWeight:700, padding:"1px 4px", borderRadius:10,
          }}>
            🌿{d.impulse}
          </div>
        )}
      </div>
      <div style={{ textAlign:"center", marginTop:5 }}>
        <div style={{ fontSize:10, fontWeight:700, color: glassText }}>{d.month}</div>
        <div style={{ fontSize:9, color: glassSubtext }}>{fmt(d.spent)}</div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Budget() {
  // ── Pull live data from FinanceContext ────────────────────────────────────
  const { transactions, totalExpense, totalIncome, budget: budgetLimit, setBudget } = useContext(FinanceContext);

  // ── Derive per-category spending from real transactions ───────────────────
  const categorySpending = React.useMemo(() => {
    const map = {};
    transactions
      .filter(t => t.type === "expense")
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + Number(t.amount);
      });
    return map;
  }, [transactions]);

  // ── Build category list from actual spending ───────────────────────────────
  const categories = React.useMemo(() => {
    const totalExp = totalExpense || 1;
    return Object.entries(categorySpending).map(([name, spent]) => {
      const meta = CATEGORY_META[name] || { icon: "◆", color: "#94A3B8", accent: "#64748B" };
      // Proportional budget per category based on overall budget limit
      const proportion = spent / totalExp;
      const catBudget = budgetLimit > 0 ? Math.round(budgetLimit * proportion * 1.25) : spent * 1.25;
      return {
        id: name.toLowerCase(),
        name,
        icon: meta.icon,
        budget: catBudget,
        spent,
        color: meta.color,
        accent: meta.accent,
      };
    });
  }, [categorySpending, budgetLimit, totalExpense]);

  // ── Monthly seasonal data from real transactions ───────────────────────────
  const seasonal = React.useMemo(() => {
    const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthMap = {};

    transactions
      .filter(t => t.type === "expense")
      .forEach(t => {
        const d = new Date(t.date);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (!monthMap[key]) {
          monthMap[key] = { month: MONTH_NAMES[d.getMonth()], spent: 0, impulse: 0, year: d.getFullYear(), monthIdx: d.getMonth() };
        }
        monthMap[key].spent += Number(t.amount);
        // Heuristic: transactions < ₹500 count as impulse buys
        if (Number(t.amount) < 500) monthMap[key].impulse += 1;
      });

    const sorted = Object.values(monthMap)
      .sort((a, b) => a.year !== b.year ? a.year - b.year : a.monthIdx - b.monthIdx)
      .slice(-7);

    // Assign budgets: use global budget if set, else 110% of avg spend
    const avgSpend = sorted.reduce((s, m) => s + m.spent, 0) / (sorted.length || 1);
    const monthBudget = budgetLimit > 0 ? budgetLimit : Math.round(avgSpend * 1.1);
    return sorted.map(m => ({ ...m, budget: monthBudget }));
  }, [transactions, budgetLimit]);

  // ── Correlations derived from category spending ────────────────────────────
  const correlations = React.useMemo(() => {
    const cats = Object.keys(categorySpending);
    const pairs = [];
    const insights = {
      "Food+Entertainment": { label: "You dine out around entertainment events", strength: 0.82 },
      "Shopping+Food":      { label: "Weekend shopping trips include dining",    strength: 0.67 },
      "Travel+Food":        { label: "Commute routes pass high-spend areas",     strength: 0.54 },
    };
    if (cats.includes("Food") && cats.includes("Entertainment"))
      pairs.push({ a:"food", b:"entertainment", ...insights["Food+Entertainment"] });
    if (cats.includes("Shopping") && cats.includes("Food"))
      pairs.push({ a:"shopping", b:"food", ...insights["Shopping+Food"] });
    if (cats.includes("Travel") && cats.includes("Food"))
      pairs.push({ a:"travel", b:"food", ...insights["Travel+Food"] });
    // Fallback if not enough
    if (pairs.length === 0 && cats.length >= 2) {
      pairs.push({ a: cats[0].toLowerCase(), b: cats[1].toLowerCase(), label: "These two categories often spike together", strength: 0.6 });
    }
    return pairs;
  }, [categorySpending]);

  // ── Core budget numbers ───────────────────────────────────────────────────
  const currentSpending = totalExpense;
  const effectiveBudget = budgetLimit > 0 ? budgetLimit : currentSpending * 1.2;
  const spentPct     = Math.min((currentSpending / effectiveBudget) * 100, 100);
  const remainingPct = Math.max(100 - spentPct, 0);
  const remaining    = effectiveBudget - currentSpending;

  // ── Budget input state ────────────────────────────────────────────────────
  const [showBudgetInput, setShowBudgetInput] = useState(budgetLimit === 0);
  const [budgetInputVal, setBudgetInputVal] = useState(budgetLimit || "");

  const [themeState] = useState("warning");
  const [activeTab, setActiveTab]   = useState(null);
  const [goals, setGoals]           = useState(GOALS);
  const [reservoir, setReservoir]   = useState({ saved: 32500, target: 60000 });
  const [dragging, setDragging]     = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [transfer, setTransfer]     = useState(null);
  const [transferAmt, setTransferAmt] = useState(500);
  const [toast, setToast]           = useState(null);
  const [activeMonth, setActiveMonth] = useState(() => Math.max(0, seasonal.length - 1));
  const [activeCross, setActiveCross] = useState(null);
  const [reservoirInput, setReservoirInput] = useState(1000);
  const [showReservoirInput, setShowReservoirInput] = useState(false);
  // Local budget overrides for pollinate tab (resets each session)
  const [localBudgetOverrides, setLocalBudgetOverrides] = useState({});


  useEffect(() => setActiveMonth(Math.max(0, seasonal.length - 1)), [seasonal.length]);

  const theme  = THEMES[themeState];
  const wilted = themeState === "over" || themeState === "storm";

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }, []);

  // Merge real categories with local budget overrides for pollinate tab
  const displayCategories = React.useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      budget: localBudgetOverrides[cat.id] !== undefined ? localBudgetOverrides[cat.id] : cat.budget,
    }));
  }, [categories, localBudgetOverrides]);

  const rain = useRef(
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${(i * 1.27 + 1.5) % 100}%`,
      delay: `${((i * 41) % 210) / 100}s`,
      dur: `${0.5 + (i % 9) * 0.07}s`,
    }))
  ).current;

  const clouds = useRef([
    { id:1, top:"7%",  w:200, h:75,  blur:14, op:0.72, dur:"30s", delay:"0s"  },
    { id:2, top:"15%", w:145, h:55,  blur:11, op:0.48, dur:"44s", delay:"12s" },
    { id:3, top:"3%",  w:260, h:100, blur:20, op:0.38, dur:"55s", delay:"24s" },
  ]).current;

  const TABS = [
    { id:"goals",     icon:"🌸", label:"Goals"      },
    { id:"seasons",   icon:"🍂", label:"Seasons"    },
    { id:"pollinate", icon:"🐝", label:"Transfer"   },
    { id:"insights",  icon:"✦", label:"Insights"   },
    { id:"reservoir", icon:"💧", label:"Reservoir"  },
  ];

  const handleTransferConfirm = () => {
    if (!transfer || transferAmt <= 0) return;
    const fromCat = displayCategories.find(c => c.id === transfer.from);
    const toCat   = displayCategories.find(c => c.id === transfer.to);
    setLocalBudgetOverrides(prev => ({
      ...prev,
      [transfer.from]: (prev[transfer.from] !== undefined ? prev[transfer.from] : fromCat?.budget || 0) - transferAmt,
      [transfer.to]:   (prev[transfer.to]   !== undefined ? prev[transfer.to]   : toCat?.budget   || 0) + transferAmt,
    }));
    showToast(`🐝 ${fmt(transferAmt)} moved from ${fromCat?.name} → ${toCat?.name}`);
    setTransfer(null);
    setDragging(null);
    setDropTarget(null);
    setTransferAmt(500);
  };

  // ─── Panel content renderer ───────────────────────────────────────────────
  const renderPanel = () => {
    switch (activeTab) {

      // ── FEATURE 1: PERENNIAL GOALS ──────────────────────────────────────
      case "goals":
        return (
          <div>
            <p style={{ fontSize:11, color:theme.glassSubtext, margin:"0 0 14px", fontStyle:"italic" }}>
              Tap a goal to add savings · Flowers grow as you save
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
              {goals.map((g) => {
                const p = pct(g.saved, g.target);
                const stageLabel = p>=100?"Full Bloom 🌺":p>=70?"Blooming 🌸":p>=40?"Bud 🌼":p>=20?"Sprout 🌿":"Seed 🌱";
                return (
                  <div key={g.id} style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius:16, padding:"14px 12px",
                    width:130, textAlign:"center", cursor:"pointer",
                    transition:"transform 0.2s, background 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                    onClick={() => {
                      setGoals(prev => prev.map(x => x.id === g.id
                        ? { ...x, saved: Math.min(x.saved + 2000, x.target) }
                        : x
                      ));
                      if (p < 100) showToast(`💰 ${fmt(2000)} added to ${g.name}`);
                    }}
                  >
                    <PerennialFlower percentage={p} color={g.color} size={90} />
                    <div style={{ fontSize:12, fontWeight:700, color:theme.glassText, marginTop:6 }}>{g.name}</div>
                    <div style={{ fontSize:9, color:g.color, fontWeight:700, marginTop:2 }}>{stageLabel}</div>
                    <div style={{ height:4, background:"rgba(255,255,255,0.15)", borderRadius:99, overflow:"hidden", margin:"8px 0 4px" }}>
                      <div style={{ height:"100%", width:`${p}%`, background:g.color, borderRadius:99, transition:"width 0.8s ease" }} />
                    </div>
                    <div style={{ fontSize:10, color:theme.glassSubtext }}>
                      {fmt(g.saved)} / {fmt(g.target)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      // ── FEATURE 2: SEASONAL HEATMAP (real monthly data) ─────────────────
      case "seasons":
        const safeActiveMonth = Math.min(activeMonth, seasonal.length - 1);
        const sm = seasonal[safeActiveMonth] || { month:"–", spent:0, budget:1, impulse:0 };
        const smRatio = sm.spent / sm.budget;
        const smLabel = smRatio > 1.1 ? "Scorched Summer 🔥" : smRatio > 0.9 ? "Dry Autumn 🍂" : smRatio > 0.7 ? "Mild Spring 🌤" : "Lush Bloom 🌿";
        return (
          <div>
            <p style={{ fontSize:11, color:theme.glassSubtext, margin:"0 0 14px", fontStyle:"italic" }}>
              Each month is a garden scene — weeds 🌿 = small impulse buys (&lt;₹500)
            </p>
            {seasonal.length === 0 ? (
              <div style={{ textAlign:"center", color:theme.glassSubtext, fontSize:12, padding:"20px 0" }}>
                No expense transactions yet to display seasons.
              </div>
            ) : (
              <>
                <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8 }}>
                  {seasonal.map((d, i) => (
                    <SeasonalBar key={d.month + i} d={d} isActive={safeActiveMonth === i}
                      onClick={() => setActiveMonth(i)}
                      glassText={theme.glassText} glassSubtext={theme.glassSubtext}
                    />
                  ))}
                </div>
                <div style={{
                  marginTop:14, background:"rgba(255,255,255,0.08)",
                  borderRadius:14, padding:"12px 16px",
                  border:"1px solid rgba(255,255,255,0.12)",
                }}>
                  <div style={{ fontSize:13, fontWeight:700, color:theme.glassText, marginBottom:6 }}>
                    {sm.month} · {smLabel}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:theme.glassSubtext }}>
                    <span>Spent: <span style={{ color:theme.glassText, fontWeight:700 }}>{fmt(sm.spent)}</span></span>
                    <span>Budget: <span style={{ color:theme.glassText }}>{fmt(sm.budget)}</span></span>
                    <span>Impulse buys: <span style={{ color:"#FCD34D", fontWeight:700 }}>{sm.impulse}</span></span>
                  </div>
                  {sm.impulse > 3 && (
                    <div style={{ marginTop:8, fontSize:11, color:"#FCD34D", background:"rgba(252,211,77,0.1)", borderRadius:8, padding:"6px 10px" }}>
                      🌿 High weed count! Consider reviewing {sm.impulse} impulse purchases from {sm.month}.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );

      // ── FEATURE 3: POLLINATION TRANSFER (real categories) ───────────────
      case "pollinate":
        return (
          <div>
            <p style={{ fontSize:11, color:theme.glassSubtext, margin:"0 0 12px", fontStyle:"italic" }}>
              Tap a source category, then tap a destination to redistribute budget
            </p>
            {displayCategories.length === 0 ? (
              <div style={{ textAlign:"center", color:theme.glassSubtext, fontSize:12, padding:"20px 0" }}>
                No expense categories found. Add some transactions first.
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                {displayCategories.map(cat => {
                  const isDragSrc = dragging === cat.id;
                  const isDropTgt = dropTarget === cat.id;
                  const available = cat.budget - cat.spent;
                  return (
                    <div key={cat.id}
                      onClick={() => {
                        if (!dragging) { setDragging(cat.id); setDropTarget(null); }
                        else if (dragging === cat.id) { setDragging(null); setDropTarget(null); }
                        else { setDropTarget(cat.id); setTransfer({ from: dragging, to: cat.id }); }
                      }}
                      style={{
                        background: isDragSrc ? `${cat.color}33` : isDropTgt ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.07)",
                        border: isDragSrc ? `2px solid ${cat.color}` : isDropTgt ? "2px dashed rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.12)",
                        borderRadius:14, padding:"10px 8px", cursor:"pointer",
                        textAlign:"center", transition:"all 0.2s",
                        transform: isDragSrc ? "scale(1.04)" : isDropTgt ? "scale(1.03)" : "scale(1)",
                      }}
                    >
                      <div style={{ fontSize:20, marginBottom:4 }}>{cat.icon}</div>
                      <div style={{ fontSize:10, fontWeight:700, color:theme.glassText }}>{cat.name}</div>
                      <div style={{ fontSize:10, color:cat.color, marginTop:2 }}>{fmt(Math.max(available, 0))}</div>
                      {/* Mini spend bar */}
                      <div style={{ height:3, background:"rgba(255,255,255,0.12)", borderRadius:99, margin:"6px 0 4px", overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${pct(cat.spent, cat.budget)}%`, background:cat.color, borderRadius:99 }} />
                      </div>
                      <div style={{ fontSize:16, marginTop:2 }}>
                        {isDragSrc ? "🐝" : isDropTgt ? "🌸" : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {dragging && (
              <div style={{ marginTop:10, fontSize:11, color:theme.glassSubtext, textAlign:"center", fontStyle:"italic" }}>
                🐝 Bee carrying pollen from <span style={{ color:theme.glassText, fontWeight:700 }}>
                  {displayCategories.find(c=>c.id===dragging)?.name}
                </span> — tap destination category
              </div>
            )}
            {dragging && (
              <button onClick={() => { setDragging(null); setDropTarget(null); }}
                style={{
                  display:"block", margin:"8px auto 0",
                  background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)",
                  borderRadius:20, padding:"4px 14px", color:theme.glassSubtext,
                  fontSize:11, cursor:"pointer",
                }}>
                Cancel
              </button>
            )}
            {transfer && (
              <div style={{
                position:"absolute", inset:0, background:"rgba(0,0,0,0.5)",
                borderRadius:22, display:"flex", alignItems:"center", justifyContent:"center", zIndex:10,
              }}>
                <div style={{
                  background:"rgba(15,15,30,0.95)", border:"1px solid rgba(255,255,255,0.2)",
                  borderRadius:18, padding:"22px 20px", width:260, textAlign:"center",
                }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>🐝</div>
                  <div style={{ fontSize:14, fontWeight:700, color:"white", marginBottom:4 }}>Transfer Budget</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", marginBottom:16 }}>
                    {displayCategories.find(c=>c.id===transfer.from)?.name} → {displayCategories.find(c=>c.id===transfer.to)?.name}
                  </div>
                  <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:12, flexWrap:"wrap" }}>
                    {[500,1000,2000,5000].map(q => (
                      <button key={q} onClick={() => setTransferAmt(q)}
                        style={{
                          padding:"4px 10px", borderRadius:20, fontSize:11, cursor:"pointer",
                          background: transferAmt===q ? "#34D399" : "rgba(255,255,255,0.1)",
                          color: transferAmt===q ? "#052e16" : "white", border:"none", fontWeight:700,
                        }}>{fmt(q)}</button>
                    ))}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", background:"rgba(255,255,255,0.08)", borderRadius:10, padding:"8px 12px", marginBottom:14 }}>
                    <span style={{ color:"#34D399", fontWeight:700, fontSize:16 }}>₹</span>
                    <input type="number" value={transferAmt} onChange={e=>setTransferAmt(Number(e.target.value))}
                      style={{
                        flex:1, background:"none", border:"none", outline:"none", color:"white",
                        fontSize:18, fontWeight:700, paddingLeft:6, fontFamily:"inherit",
                      }}
                    />
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => { setTransfer(null); setDragging(null); setDropTarget(null); }}
                      style={{
                        flex:1, height:36, borderRadius:10, border:"1px solid rgba(255,255,255,0.15)",
                        background:"transparent", color:"rgba(255,255,255,0.6)", fontSize:12, cursor:"pointer",
                      }}>Cancel</button>
                    <button onClick={handleTransferConfirm}
                      style={{
                        flex:2, height:36, borderRadius:10, border:"none",
                        background:"linear-gradient(135deg,#34D399,#10B981)",
                        color:"#052e16", fontSize:12, fontWeight:800, cursor:"pointer",
                      }}>✦ Transfer</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      // ── FEATURE 4: CROSS-POLLINATION INSIGHTS (real categories) ─────────
      case "insights":
        return (
          <div>
            <p style={{ fontSize:11, color:theme.glassSubtext, margin:"0 0 14px", fontStyle:"italic" }}>
              Pollen trails show correlated spending habits between categories
            </p>
            {correlations.length === 0 ? (
              <div style={{ textAlign:"center", color:theme.glassSubtext, fontSize:12, padding:"20px 0" }}>
                Add more transactions across different categories to reveal spending patterns.
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {correlations.map((corr, i) => {
                  const catA = displayCategories.find(c => c.id === corr.a) || categories.find(c => c.name.toLowerCase() === corr.a);
                  const catB = displayCategories.find(c => c.id === corr.b) || categories.find(c => c.name.toLowerCase() === corr.b);
                  const isOpen = activeCross === i;
                  return (
                    <div key={i}
                      onClick={() => setActiveCross(isOpen ? null : i)}
                      style={{
                        background: isOpen ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.07)",
                        border: `1px ${isOpen ? "solid" : "dashed"} rgba(255,255,255,${isOpen?0.3:0.15})`,
                        borderRadius:14, padding:"12px 14px", cursor:"pointer", transition:"all 0.2s",
                      }}
                    >
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{
                          width:32, height:32, borderRadius:8, fontSize:16,
                          background:`${catA?.color || "#94A3B8"}22`, border:`1px solid ${catA?.color || "#94A3B8"}55`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                        }}>{catA?.icon || "◆"}</div>
                        <div style={{ flex:1, height:24, position:"relative" }}>
                          <svg width="100%" height="24" style={{ position:"absolute" }}>
                            <line x1="0" y1="12" x2="100%" y2="12" stroke="rgba(253,216,53,0.4)" strokeWidth={1.5} strokeDasharray="5 4"/>
                            {[15,30,45,60,75,90].map(xp => (
                              <circle key={xp} cx={`${xp}%`} cy="12" r="2" fill="rgba(253,216,53,0.8)"
                                style={{ animation:`pollenFloat 2s ${xp/150}s ease-in-out infinite` }}
                              />
                            ))}
                          </svg>
                          <div style={{
                            position:"absolute", left:"50%", transform:"translateX(-50%)",
                            background:"rgba(253,216,53,0.15)", border:"1px solid rgba(253,216,53,0.3)",
                            color:"#FCD34D", fontSize:9, fontWeight:800,
                            padding:"2px 8px", borderRadius:20, whiteSpace:"nowrap", top:4,
                          }}>
                            {Math.round(corr.strength * 100)}% linked
                          </div>
                        </div>
                        <div style={{
                          width:32, height:32, borderRadius:8, fontSize:16,
                          background:`${catB?.color || "#94A3B8"}22`, border:`1px solid ${catB?.color || "#94A3B8"}55`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                        }}>{catB?.icon || "◆"}</div>
                      </div>
                      {isOpen && (
                        <div style={{ marginTop:12, paddingTop:12, borderTop:"1px dashed rgba(255,255,255,0.12)" }}>
                          <div style={{ fontSize:12, color:theme.glassText, marginBottom:8, fontStyle:"italic" }}>
                            🌿 {corr.label}
                          </div>
                          <div style={{ display:"flex", gap:8 }}>
                            {[catA, catB].filter(Boolean).map(cat => (
                              <div key={cat?.id} style={{
                                flex:1, background:"rgba(255,255,255,0.06)", borderRadius:10,
                                padding:"8px 10px", textAlign:"center",
                              }}>
                                <div style={{ fontSize:10, color:theme.glassSubtext }}>Total spent</div>
                                <div style={{ fontSize:15, fontWeight:800, color:cat?.color }}>{fmt(cat?.spent || 0)}</div>
                                <div style={{ fontSize:10, color:theme.glassSubtext }}>{cat?.name}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      // ── FEATURE 5: RAINY DAY RESERVOIR ──────────────────────────────────
      case "reservoir":
        const resLevel = Math.min(reservoir.saved / reservoir.target, 1);
        const resFlowerVibrancy = 0.35 + resLevel * 0.65;
        return (
          <div>
            <p style={{ fontSize:11, color:theme.glassSubtext, margin:"0 0 14px", fontStyle:"italic" }}>
              Your emergency fund · Water level reflects financial safety
            </p>
            <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
              <div style={{ flexShrink:0 }}>
                <svg width={120} height={150} viewBox="0 0 120 150">
                  <rect x={0} y={110} width={120} height={40} fill="rgba(139,99,71,0.2)" />
                  <rect x={15} y={30} width={90} height={105} fill="none"
                    stroke="rgba(255,255,255,0.3)" strokeWidth={2} rx={8} />
                  <clipPath id="resClip">
                    <rect x={17} y={32} width={86} height={101} rx={6} />
                  </clipPath>
                  <g clipPath="url(#resClip)">
                    <rect x={17} y={32 + (1 - resLevel) * 101}
                      width={86} height={resLevel * 101 + 20}
                      fill={resLevel > 0.6 ? "rgba(74,144,184,0.6)" : resLevel > 0.3 ? "rgba(74,144,184,0.4)" : "rgba(74,144,184,0.25)"}
                      style={{ transition:"all 1s ease" }}
                    />
                    <path
                      d={`M17 ${32 + (1 - resLevel) * 101} Q44 ${30 + (1 - resLevel) * 101} 60 ${32 + (1 - resLevel) * 101} Q76 ${34 + (1 - resLevel) * 101} 103 ${32 + (1 - resLevel) * 101}`}
                      stroke="rgba(147,197,253,0.6)" strokeWidth={2} fill="none"
                      style={{ animation:"waveAnim 3s ease-in-out infinite" }}
                    />
                  </g>
                  {[25,50,75].map(pv => (
                    <g key={pv}>
                      <line x1={102} y1={32 + (1 - pv/100) * 101} x2={108} y2={32 + (1 - pv/100) * 101}
                        stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
                      <text x={110} y={36 + (1 - pv/100) * 101} fontSize={8} fill="rgba(255,255,255,0.4)">{pv}%</text>
                    </g>
                  ))}
                  <rect x={54} y={0} width={7} height={33} fill="rgba(147,197,253,0.4)" rx={2} />
                  {[0,1,2].map(di => (
                    <circle key={di} cx={57.5} cy={8} r={1.5} fill="rgba(147,197,253,0.8)"
                      style={{ animation:`drip 0.9s ${di*0.3}s linear infinite` }}
                    />
                  ))}
                  <text x={60} y={88} textAnchor="middle" fontSize={16} fontWeight="bold" fill="rgba(147,197,253,0.9)">
                    {Math.round(resLevel * 100)}%
                  </text>
                  <text x={60} y={102} textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.4)">
                    {fmt(reservoir.saved)}
                  </text>
                </svg>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:700, color:theme.glassText, marginBottom:4 }}>Emergency Fund</div>
                <div style={{ fontSize:11, color:theme.glassSubtext, marginBottom:12 }}>
                  Goal: {fmt(reservoir.target)} · {fmt(reservoir.target - reservoir.saved)} to go
                </div>
                <div style={{
                  background:"rgba(255,255,255,0.07)", borderRadius:10, padding:"8px 12px", marginBottom:12,
                  display:"flex", alignItems:"center", gap:8,
                }}>
                  <span style={{ fontSize:18, opacity:resFlowerVibrancy }}>🌸</span>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:resLevel > 0.6 ? "#6EE7B7" : resLevel > 0.3 ? "#FCD34D" : "#F472B6" }}>
                      {resLevel > 0.8 ? "Garden thriving" : resLevel > 0.5 ? "Garden healthy" : resLevel > 0.2 ? "Garden needs water" : "Garden is thirsty"}
                    </div>
                    <div style={{ fontSize:10, color:theme.glassSubtext }}>
                      {resLevel < 0.5 ? "Low fund reduces garden vibrancy" : "Full reservoir = flourishing garden"}
                    </div>
                  </div>
                </div>
                {!showReservoirInput ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                    <button onClick={() => setShowReservoirInput(true)}
                      style={{
                        height:36, borderRadius:10, border:"none",
                        background:"linear-gradient(135deg,rgba(74,144,184,0.8),rgba(37,99,235,0.8))",
                        color:"white", fontSize:12, fontWeight:700, cursor:"pointer",
                      }}>💧 Add to Reservoir</button>
                    <button onClick={() => {
                        setReservoir(r => ({ ...r, saved: Math.max(0, r.saved - 2000) }));
                        showToast("Withdrew ₹2,000 from reservoir");
                      }}
                      style={{
                        height:36, borderRadius:10, border:"1px solid rgba(255,255,255,0.15)",
                        background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.6)",
                        fontSize:12, cursor:"pointer",
                      }}>↑ Withdraw ₹2,000</button>
                  </div>
                ) : (
                  <div>
                    <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>
                      {[1000,2000,5000].map(q => (
                        <button key={q} onClick={() => setReservoirInput(q)}
                          style={{
                            padding:"4px 10px", borderRadius:20, border:"none",
                            background: reservoirInput===q ? "rgba(74,144,184,0.8)" : "rgba(255,255,255,0.1)",
                            color:"white", fontSize:11, fontWeight:700, cursor:"pointer",
                          }}>{fmt(q)}</button>
                      ))}
                    </div>
                    <div style={{
                      display:"flex", alignItems:"center",
                      background:"rgba(255,255,255,0.08)", borderRadius:10, padding:"6px 10px", marginBottom:8,
                    }}>
                      <span style={{ color:"rgba(147,197,253,0.9)", fontWeight:700 }}>₹</span>
                      <input type="number" value={reservoirInput} onChange={e=>setReservoirInput(Number(e.target.value))}
                        style={{
                          flex:1, background:"none", border:"none", outline:"none", color:"white",
                          fontSize:16, fontWeight:700, paddingLeft:6, fontFamily:"inherit",
                        }}
                      />
                    </div>
                    <div style={{ display:"flex", gap:7 }}>
                      <button onClick={() => setShowReservoirInput(false)}
                        style={{
                          flex:1, height:34, borderRadius:10, border:"1px solid rgba(255,255,255,0.12)",
                          background:"transparent", color:"rgba(255,255,255,0.5)", fontSize:11, cursor:"pointer",
                        }}>Cancel</button>
                      <button onClick={() => {
                          setReservoir(r => ({ ...r, saved: Math.min(r.saved + reservoirInput, r.target) }));
                          showToast(`💧 ${fmt(reservoirInput)} added to reservoir`);
                          setShowReservoirInput(false);
                        }}
                        style={{
                          flex:2, height:34, borderRadius:10, border:"none",
                          background:"linear-gradient(135deg,rgba(74,144,184,0.9),rgba(37,99,235,0.9))",
                          color:"white", fontSize:11, fontWeight:700, cursor:"pointer",
                        }}>💧 Add {fmt(reservoirInput)}</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", width:"100%", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=DM+Sans:wght@400;500;700&display=swap');
        @keyframes bg-rain { 0%{transform:translateY(-30px);opacity:0} 8%{opacity:1} 100%{transform:translateY(100vh);opacity:0.6} }
        @keyframes bg-sway { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} }
        @keyframes bg-wilt { to{transform:rotate(58deg) scaleY(0.62)} }
        @keyframes bg-cloud { from{transform:translateX(-15%)} to{transform:translateX(120vw)} }
        @keyframes bg-sun { 0%,100%{transform:scale(1);opacity:.9} 50%{transform:scale(1.07);opacity:1} }
        @keyframes bg-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes goalSparkle { 0%,100%{opacity:0.2;transform:scale(0.7)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes pollenFloat { 0%,100%{opacity:0.4;transform:translateY(0)} 50%{opacity:1;transform:translateY(-3px)} }
        @keyframes waveAnim { 0%,100%{} 50%{} }
        @keyframes drip { 0%{cy:8;opacity:0.8} 100%{cy:33;opacity:0} }
        @keyframes panelIn { from{opacity:0;transform:translateY(12px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes tabPulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,0.0)} 50%{box-shadow:0 0 0 4px rgba(255,255,255,0.12)} }
        * { box-sizing:border-box; }
        input[type=number]::-webkit-inner-spin-button { opacity:0; }
        ::-webkit-scrollbar { height:4px; width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.2); border-radius:99px; }
      `}</style>

      <div style={{
        position:"relative", display:"flex", flexDirection:"column",
        flex:1, minHeight:"100%", overflow:"hidden",
        fontFamily:"'DM Sans', system-ui, sans-serif",
      }}>
        {/* SKY */}
        <div style={{
          position:"absolute", inset:0, zIndex:0,
          background:`linear-gradient(to bottom, ${theme.skyFrom}, ${theme.skyTo})`,
          transition:"background 1.5s ease",
        }} />

        {/* CLOUDS */}
        {theme.hasClouds && clouds.map(c => (
          <div key={c.id} style={{
            position:"absolute", top:c.top, left:"-20%", zIndex:1,
            width:c.w, height:c.h, borderRadius:"50%",
            background:"rgba(255,255,255,0.88)",
            filter:`blur(${c.blur}px)`, opacity:c.op,
            animation:`bg-cloud ${c.dur} linear ${c.delay} infinite`,
            pointerEvents:"none",
          }} />
        ))}

        {/* SUN */}
        {theme.hasSun && (
          <div style={{
            position:"absolute", top:"10%", right:"8%", zIndex:1,
            width:84, height:84, borderRadius:"50%",
            background:`radial-gradient(circle at 38% 38%, ${theme.sunColor} 32%, ${theme.sunColor}44 62%, transparent 76%)`,
            boxShadow:`0 0 32px 16px ${theme.sunGlow}`,
            animation:"bg-sun 4s ease-in-out infinite", pointerEvents:"none",
          }} />
        )}

        {/* RAIN */}
        {theme.hasRain && rain.map(r => (
          <div key={r.id} style={{
            position:"absolute", top:-30, left:r.left, zIndex:2,
            width:1.5, height:22, borderRadius:3,
            background:"linear-gradient(to bottom, transparent, rgba(147,197,253,0.85))",
            animation:`bg-rain ${r.dur} linear ${r.delay} infinite`, pointerEvents:"none",
          }} />
        ))}

        {/* BODY */}
        <div style={{ position:"relative", zIndex:5, display:"flex", flexDirection:"column", flex:1 }}>

          {/* TOP: BUDGET HEALTH CARD */}
          <div style={{ flex:"0 0 auto", display:"flex", justifyContent:"center", padding:"40px 20px 0", zIndex:10, marginTop:50}}>
            <GlassPanel theme={theme} style={{ padding:"22px 28px", maxWidth:720, width:"100%" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <span style={{
                  color:theme.glassText, fontSize:18, letterSpacing:"0.15em",
                  textTransform:"uppercase", fontWeight:700,
                  fontFamily:"'Cormorant Garamond', Georgia, serif",
                }}>Budget Health</span>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ color:theme.labelColor, fontSize:11, fontWeight:700, letterSpacing:"0.08em" }}>
                    {theme.label}
                  </span>
                  {/* Edit budget button */}
                  <button
                    onClick={() => setShowBudgetInput(v => !v)}
                    style={{
                      fontSize:10, padding:"3px 8px", borderRadius:20,
                      border:"1px solid rgba(255,255,255,0.25)",
                      background:"rgba(255,255,255,0.1)", color:theme.glassText,
                      cursor:"pointer", fontWeight:700,
                    }}>
                    {showBudgetInput ? "✕" : "✎ Set Budget"}
                  </button>
                </div>
              </div>

              {/* Budget input */}
              {showBudgetInput && (
                <div style={{
                  display:"flex", gap:8, marginBottom:14, alignItems:"center",
                  background:"rgba(255,255,255,0.08)", borderRadius:12, padding:"8px 12px",
                }}>
                  <span style={{ color:theme.glassText, fontWeight:700 }}>₹</span>
                  <input
                    type="number"
                    placeholder="Enter monthly budget limit"
                    value={budgetInputVal}
                    onChange={e => setBudgetInputVal(e.target.value)}
                    style={{
                      flex:1, background:"none", border:"none", outline:"none",
                      color:"white", fontSize:15, fontWeight:700, fontFamily:"inherit",
                    }}
                  />
                  <button
                    onClick={() => {
                      const val = Number(budgetInputVal);
                      if (val > 0) {
                        setBudget(val);
                        showToast(`✅ Budget set to ${fmt(val)}`);
                        setShowBudgetInput(false);
                      }
                    }}
                    style={{
                      padding:"4px 12px", borderRadius:10, border:"none",
                      background:"#34D399", color:"#052e16",
                      fontSize:11, fontWeight:800, cursor:"pointer",
                    }}>Set</button>
                </div>
              )}

              <div style={{ width:"100%", height:11, background:"rgba(255,255,255,0.15)", borderRadius:99, overflow:"hidden" }}>
                <div style={{
                  height:"100%", width:`${spentPct}%`,
                  background:theme.barGradient, backgroundSize:"200% 100%", borderRadius:99,
                  animation:"bg-shimmer 2.5s linear infinite",
                  transition:"width 1.2s cubic-bezier(.4,0,.2,1)",
                }} />
              </div>

              <div style={{ display:"flex", justifyContent:"space-between", marginTop:14 }}>
                {[
                  ["Remaining", budgetLimit > 0 ? fmt(remaining) : "—"],
                  ["Spent",     fmt(currentSpending)],
                  ["Income",    fmt(totalIncome)],
                  ["Limit",     budgetLimit > 0 ? fmt(effectiveBudget) : "Not set"],
                ].map(([label, value]) => (
                  <div key={label} style={{ textAlign:"center" }}>
                    <div style={{ color:"rgba(255,255,255,0.4)", fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:4 }}>
                      {label}
                    </div>
                    <div style={{ color:"#fff", fontSize:13, fontWeight:700 }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Top spending categories bar */}
              {categories.length > 0 && (
                <div style={{ marginTop:14 }}>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.35)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>
                    Spending by Category
                  </div>
                  <div style={{ display:"flex", height:6, borderRadius:99, overflow:"hidden", gap:1 }}>
                    {categories.slice(0,6).map(cat => (
                      <div key={cat.id} title={`${cat.name}: ${fmt(cat.spent)}`}
                        style={{
                          flex: cat.spent,
                          background: cat.color,
                          transition:"flex 0.8s ease",
                          minWidth: cat.spent > 0 ? 4 : 0,
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:8, marginTop:6, flexWrap:"wrap" }}>
                    {categories.slice(0,6).map(cat => (
                      <div key={cat.id} style={{ display:"flex", alignItems:"center", gap:3 }}>
                        <div style={{ width:6, height:6, borderRadius:"50%", background:cat.color }} />
                        <span style={{ fontSize:9, color:"rgba(255,255,255,0.5)" }}>{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassPanel>
          </div>

          {/* FEATURE PANEL */}
          {activeTab && (
            <div style={{ flex:"0 0 auto", display:"flex", justifyContent:"center", padding:"20px 20px 0", zIndex:10 }}>
              <GlassPanel theme={theme} style={{
                padding:"20px 20px 18px", maxWidth:720, width:"100%",
                position:"relative", animation:"panelIn 0.3s cubic-bezier(.22,1,.36,1) both",
              }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                  <span style={{
                    fontSize:14, fontWeight:700, color:theme.glassText,
                    fontFamily:"'Cormorant Garamond', serif", letterSpacing:"0.04em",
                  }}>
                    {TABS.find(t => t.id === activeTab)?.icon}{" "}
                    {activeTab === "goals" && "Perennial Goals"}
                    {activeTab === "seasons" && "Seasonal Landscape"}
                    {activeTab === "pollinate" && "Pollination Transfer"}
                    {activeTab === "insights" && "Cross-Pollination Insights"}
                    {activeTab === "reservoir" && "Rainy Day Reservoir"}
                  </span>
                  <button
                    onClick={() => { setActiveTab(null); setDragging(null); setDropTarget(null); setTransfer(null); }}
                    style={{
                      width:24, height:24, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.2)",
                      background:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.7)",
                      fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                      lineHeight:1, padding:0,
                    }}>×</button>
                </div>
                {renderPanel()}
              </GlassPanel>
            </div>
          )}

          <div style={{ flex:1 }} />

          {/* GARDEN SECTION */}
          <div style={{ position:"relative", width:"100%" }}>
            <div style={{ width:"100%", height:2, background:theme.horizonColor, boxShadow:theme.horizonGlow }} />

            {/* TAB DOCK */}
            <div style={{
              position:"absolute", bottom:"calc(25vh + 68px)", left:"50%", transform:"translateX(-50%)",
              zIndex:8, display:"flex", gap:8,
            }}>
              {TABS.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(isActive ? null : tab.id)} title={tab.label}
                    style={{
                      display:"flex", flexDirection:"column", alignItems:"center", gap:2,
                      padding:"8px 10px 6px", borderRadius:14,
                      border: isActive ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(255,255,255,0.2)",
                      background: isActive ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
                      backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
                      cursor:"pointer", color:"white", transition:"all 0.2s",
                      animation: isActive ? "tabPulse 2s ease-in-out infinite" : "none",
                      transform: isActive ? "translateY(-3px)" : "none",
                    }}>
                    <span style={{ fontSize:18, lineHeight:1 }}>{tab.icon}</span>
                    <span style={{ fontSize:8, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", opacity:0.8 }}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* FLOWERS */}
            <div style={{
              position:"absolute", bottom:2, left:0, right:0,
              display:"flex", justifyContent:"center", alignItems:"flex-end",
              gap:36, zIndex:6,
            }}>
              {Array(FLOWER_COUNT).fill(0).map((_, i) => {
                const resLevel = Math.min(reservoir.saved / reservoir.target, 1);
                const color = theme.flowerColors[i % theme.flowerColors.length];
                return (
                  <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                    <div style={{
                      transformOrigin:"bottom center", display:"inline-block",
                      opacity: (themeState === "blooming") ? (0.35 + resLevel * 0.65) : 1,
                      animation: wilted
                        ? `bg-wilt 1.8s ease-out ${i * 0.13}s forwards`
                        : `bg-sway ${2.3 + (i % 4) * 0.4}s ease-in-out ${i * 0.2}s infinite`,
                    }}>
                      <Flower2 size={58} style={{
                        display:"block", color,
                        filter: theme.flowerGlow ? `drop-shadow(0 0 9px ${color}BB)` : "none",
                      }} />
                    </div>
                    <Flower2 size={58} style={{
                      display:"block", color, opacity:0.12,
                      transform:"scaleY(-1)", marginTop:-4,
                    }} />
                  </div>
                );
              })}
            </div>

            {/* GROUND */}
            <div style={{
              width:"100%", height:"25vh",
              background:`linear-gradient(to bottom, ${theme.groundFrom}, ${theme.groundTo})`,
              transition:"background 1.5s ease", zIndex:5,
            }} />
          </div>
        </div>

        {/* TOAST */}
        {toast && (
          <div style={{
            position:"fixed", bottom:30, left:"50%", transform:"translateX(-50%)",
            background:"rgba(10,10,20,0.92)", color:"white",
            padding:"11px 22px", borderRadius:99, fontSize:13, fontWeight:700,
            border:"1px solid rgba(255,255,255,0.15)", backdropFilter:"blur(16px)",
            zIndex:999, whiteSpace:"nowrap", boxShadow:"0 8px 30px rgba(0,0,0,0.4)",
            animation:"panelIn 0.25s ease both",
          }}>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
