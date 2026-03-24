import React, { useState, useRef, useEffect } from "react";
import { TrendingUp, TrendingDown, Zap, Compass, AlertTriangle, Target, ChevronDown, BarChart2, PieChart, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── DATA ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Rent",          value: 8000, budget: 8000, icon: "🏠", color: "#D4AF37" },
  { name: "Food",          value: 3200, budget: 3000, icon: "🍜", color: "#F9E27E" },
  { name: "Shopping",      value: 2600, budget: 2000, icon: "🛍️", color: "#E8C96A" },
  { name: "Entertainment", value: 1800, budget: 1200, icon: "🎮", color: "#C9A227" },
  { name: "Travel",        value: 1200, budget: 1500, icon: "✈️", color: "#B8962E" },
  { name: "Health",        value:  600, budget: 1000, icon: "💊", color: "#A07830" },
];

const WEEKLY_DATA = {
  "This Week":  [420, 380, 590, 310, 720, 450, 280],
  "Last Week":  [350, 510, 290, 630, 400, 480, 390],
  "2 Weeks Ago":[600, 270, 480, 350, 520, 310, 440],
};
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MONTHLY_DATA = [12400, 15800, 11200, 18600, 16900, 17400];
const MONTHS       = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

// ── HELPERS ──────────────────────────────────────────────────────────────────
const fmt  = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const pct  = (a, b) => Math.round((a / b) * 100);
const total = CATEGORIES.reduce((s, c) => s + c.value, 0);

// ── MINI SPARKLINE ────────────────────────────────────────────────────────────
function Sparkline({ data, color = "#D4AF37", height = 40, width = 120 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`
  ).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} style={{ overflow:"visible" }}>
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="1.5"
        strokeLinejoin="round" strokeLinecap="round" points={pts} />
    </svg>
  );
}

// ── DONUT CHART ───────────────────────────────────────────────────────────────
function DonutChart({ categories, size = 180 }) {
  const [hov, setHov] = useState(null);
  const r = 60, cx = size / 2, cy = size / 2, stroke = 22;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  const slices = categories.map((cat) => {
    const fraction = cat.value / total;
    const slice = { ...cat, fraction, dashArray: fraction * circumference, dashOffset: -offset * circumference };
    offset += fraction;
    return slice;
  });

  const hovered = hov !== null ? categories[hov] : null;

  return (
    <div style={{ position:"relative", width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        {slices.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color}
            strokeWidth={hov === i ? stroke + 4 : stroke}
            strokeDasharray={`${s.dashArray} ${circumference}`}
            strokeDashoffset={s.dashOffset}
            strokeLinecap="butt"
            style={{ cursor:"pointer", transition:"stroke-width 0.2s", filter: hov===i ? `drop-shadow(0 0 8px ${s.color})` : "none" }}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
          />
        ))}
      </svg>
      {/* Center label */}
      <div style={{
        position:"absolute", inset:0, display:"flex",
        flexDirection:"column", alignItems:"center", justifyContent:"center",
        pointerEvents:"none",
      }}>
        {hovered ? (
          <>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", letterSpacing:"0.1em" }}>{hovered.icon} {hovered.name}</div>
            <div style={{ fontSize:16, fontWeight:700, color:"#F9E27E", marginTop:2 }}>{fmt(hovered.value)}</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>{pct(hovered.value, total)}%</div>
          </>
        ) : (
          <>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", letterSpacing:"0.1em" }}>TOTAL</div>
            <div style={{ fontSize:18, fontWeight:700, color:"#F9E27E" }}>{fmt(total)}</div>
          </>
        )}
      </div>
    </div>
  );
}

// ── BAR CHART ─────────────────────────────────────────────────────────────────
function BarChart({ data, labels, color = "#D4AF37", height = 100 }) {
  const [hov, setHov] = useState(null);
  const max = Math.max(...data);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:6, height, width:"100%" }}>
      {data.map((v, i) => {
        const barH = (v / max) * height;
        const isHov = hov === i;
        return (
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <AnimatePresence>
              {isHov && (
                <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  style={{ fontSize:9, color:"#F9E27E", whiteSpace:"nowrap", marginBottom:2 }}>
                  {fmt(v)}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              initial={{ height:0 }} animate={{ height: barH }}
              transition={{ duration:0.6, delay: i*0.05, ease:"easeOut" }}
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
              style={{
                width:"100%", borderRadius:"3px 3px 0 0",
                background: isHov
                  ? `linear-gradient(to top, ${color}, #F9E27E)`
                  : `linear-gradient(to top, ${color}88, ${color}44)`,
                boxShadow: isHov ? `0 0 12px ${color}66` : "none",
                cursor:"pointer", transition:"background 0.2s, box-shadow 0.2s",
              }}
            />
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.35)", letterSpacing:"0.05em" }}>{labels[i]}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── LINE CHART ────────────────────────────────────────────────────────────────
function LineChart({ datasets, labels, height = 120, width = 400 }) {
  const [hov, setHov]     = useState(null);
  const svgRef            = useRef();
  const allVals           = Object.values(datasets).flat();
  const max               = Math.max(...allVals);
  const min               = Math.min(...allVals) * 0.85;
  const range             = max - min;
  const colors            = { "This Week":"#F9E27E", "Last Week":"#D4AF37", "2 Weeks Ago":"#8B6914" };

  const toY = (v) => height - ((v - min) / range) * height;
  const toX = (i) => (i / (labels.length - 1)) * width;

  return (
    <div style={{ position:"relative" }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height}
        ref={svgRef} style={{ overflow:"visible" }}>
        <defs>
          {Object.entries(colors).map(([key, col]) => (
            <linearGradient key={key} id={`fill-${key.replace(/\s/g,"")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={col} stopOpacity="0.2" />
              <stop offset="100%" stopColor={col} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75, 1].map(f => (
          <line key={f} x1={0} y1={toY(min + range * f)} x2={width} y2={toY(min + range * f)}
            stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="4 4" />
        ))}

        {Object.entries(datasets).map(([key, data]) => {
          const pts = data.map((v,i) => `${toX(i)},${toY(v)}`).join(" ");
          const fillPts = `0,${height} ` + data.map((v,i) => `${toX(i)},${toY(v)}`).join(" ") + ` ${width},${height}`;
          const col = colors[key];
          return (
            <g key={key}>
              <polygon points={fillPts} fill={`url(#fill-${key.replace(/\s/g,"")})`} />
              <polyline fill="none" stroke={col} strokeWidth={key==="This Week" ? 2 : 1}
                strokeLinejoin="round" strokeLinecap="round" points={pts}
                strokeOpacity={key==="This Week" ? 1 : 0.45}
                strokeDasharray={key==="2 Weeks Ago" ? "4 3" : "none"} />
              {key === "This Week" && data.map((v,i) => (
                <circle key={i} cx={toX(i)} cy={toY(v)} r={hov===i ? 4 : 2.5}
                  fill={col} stroke="#0a0a0f" strokeWidth={1.5}
                  onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
                  style={{ cursor:"pointer", transition:"r 0.15s" }} />
              ))}
            </g>
          );
        })}

        {/* Hover tooltip */}
        {hov !== null && (
          <g>
            <line x1={toX(hov)} y1={0} x2={toX(hov)} y2={height}
              stroke="rgba(249,226,126,0.3)" strokeWidth={1} strokeDasharray="3 3" />
          </g>
        )}
      </svg>

      {/* X labels */}
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
        {labels.map((l,i) => (
          <span key={i} style={{ fontSize:9, color: hov===i ? "#F9E27E" : "rgba(255,255,255,0.3)",
            letterSpacing:"0.08em", transition:"color 0.15s" }}>{l}</span>
        ))}
      </div>

      {/* Hover value */}
      {hov !== null && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          style={{ position:"absolute", top:-24, left: `${(hov/(labels.length-1))*100}%`,
            transform:"translateX(-50%)", background:"rgba(0,0,0,0.8)",
            border:"1px solid rgba(249,226,126,0.3)", borderRadius:6,
            padding:"3px 8px", fontSize:11, color:"#F9E27E", whiteSpace:"nowrap" }}>
          {fmt(Object.values(datasets)[0][hov])}
        </motion.div>
      )}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function Insights() {
  const [weekSel, setWeekSel]   = useState("This Week");
  const [chartTab, setChartTab] = useState("weekly"); // weekly | monthly
  const [showAll, setShowAll]   = useState(false);

  // Anomalies: categories over budget
  const anomalies = CATEGORIES.filter(c => c.value > c.budget);
  // Savings potential
  const savingsPotential = CATEGORIES.reduce((s,c) => s + Math.max(c.value - c.budget, 0), 0);
  // Predicted spend (simple velocity × 1.25)
  const predicted = total * 1.25;
  // Top category
  const topCat = [...CATEGORIES].sort((a,b) => b.value - a.value)[0];
  // Week trend direction
  const weekData    = WEEKLY_DATA[weekSel];
  const weekTotal   = weekData.reduce((s,v) => s+v, 0);
  const lastWeekTotal = WEEKLY_DATA["Last Week"].reduce((s,v)=>s+v,0);
  const weekDelta   = weekTotal - lastWeekTotal;
  const weekDeltaPct = Math.round(Math.abs(weekDelta / lastWeekTotal) * 100);

  const visibleCats = showAll ? CATEGORIES : CATEGORIES.slice(0,4);

  return (
    <div style={{
      position:      "relative",
      minHeight:     "100%",
      width:         "100%",
      background:    "#080810",
      color:         "#fff",
      fontFamily:    "'DM Sans', sans-serif",
      overflowY:     "auto",
      overflowX:     "hidden",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:wght@400;600;700&display=swap');
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#D4AF3744; border-radius:2px; }
        @keyframes ins-marquee {
          0%   { transform:translateX(100vw); }
          100% { transform:translateX(-100%); }
        }
        @keyframes ins-pulse-ring {
          0%   { transform:scale(1);   opacity:0.6; }
          100% { transform:scale(1.6); opacity:0;   }
        }
        @keyframes ins-shimmer {
          0%   { background-position:-200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      {/* ── AMBIENT ORBS ── */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
        <div style={{ position:"absolute", top:-80,  left:-80,  width:400, height:400,
          borderRadius:"50%", background:"#D4AF37", filter:"blur(140px)", opacity:0.07 }} />
        <div style={{ position:"absolute", bottom:-80, right:-80, width:350, height:350,
          borderRadius:"50%", background:"#F9E27E", filter:"blur(140px)", opacity:0.06 }} />
        <div style={{ position:"absolute", top:"40%", left:"50%", width:300, height:300,
          borderRadius:"50%", background:"#C9A227", filter:"blur(160px)", opacity:0.04,
          transform:"translate(-50%,-50%)" }} />
      </div>

      {/* ── CONTENT WRAPPER ── */}
      <div style={{ position:"relative",
  zIndex:1,
  maxWidth:1100,
  margin:"0 auto",
  padding: "60px 24px 60px"}}>

        {/* ── HEADER ── */}
        <div style={{textAlign:"center", marginBottom:40, marginTop:10}}>
          <h1 style={{
            fontFamily:"'Cormorant Garamond', serif",
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight:700,
            background:"linear-gradient(135deg, #D4AF37 0%, #F9E27E 50%, #C9A227 100%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            letterSpacing:"0.02em", margin:0,
          }}>Your Financial Prophecy</h1>
          <p style={{ color:"rgba(255,255,255,0.35)", fontSize:13, marginTop:8, letterSpacing:"0.06em" }}>
            Insights forged from your spending patterns
          </p>
        </div>

        {/* ── KPI ROW ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px,1fr))", gap:12, marginBottom:20 }}>
          {[
            {
              icon: <TrendingUp size={14} />,
              label: "Predicted Spend",
              value: fmt(predicted),
              sub: "+25% projected",
              color: "#F9E27E",
              warn: false,
            },
            {
              icon: <Target size={14} />,
              label: "Over Budget",
              value: fmt(savingsPotential),
              sub: `${anomalies.length} categories`,
              color: "#F87171",
              warn: savingsPotential > 0,
            },
            {
              icon: <BarChart2 size={14} />,
              label: "Top Category",
              value: topCat.name,
              sub: fmt(topCat.value),
              color: "#D4AF37",
              warn: false,
            },
            {
              icon: weekDelta > 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>,
              label: "Week vs Last",
              value: `${weekDelta > 0 ? "+" : "-"}${weekDeltaPct}%`,
              sub: fmt(weekTotal) + " this week",
              color: weekDelta > 0 ? "#F87171" : "#6EE7B7",
              warn: false,
            },
          ].map((kpi, i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: i*0.08, duration:0.4 }}
              style={{
                background:   "rgba(255,255,255,0.04)",
                border:       `1px solid ${kpi.warn ? "rgba(248,113,113,0.3)" : "rgba(212,175,55,0.15)"}`,
                borderRadius: 14,
                padding:      "14px 16px",
                backdropFilter: "blur(12px)",
              }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, color:kpi.color, marginBottom:8 }}>
                {kpi.icon}
                <span style={{ fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", opacity:0.7 }}>
                  {kpi.label}
                </span>
              </div>
              <div style={{ fontSize:22, fontWeight:600, color:kpi.color, fontFamily:"'Cormorant Garamond',serif" }}>
                {kpi.value}
              </div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:3 }}>{kpi.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* ── MAIN GRID ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>

          {/* ── CATEGORY BREAKDOWN (left, tall) ── */}
          <motion.div initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
            transition={{ delay:0.15 }}
            style={{
              background:"rgba(255,255,255,0.03)", border:"1px solid rgba(212,175,55,0.12)",
              borderRadius:18, padding:"20px 20px 16px", gridRow:"span 2",
              backdropFilter:"blur(12px)", display:"flex", flexDirection:"column", gap:14,
            }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, color:"#D4AF37" }}>
                <PieChart size={15} />
                <span style={{ fontSize:12, fontWeight:600, letterSpacing:"0.08em" }}>Category Breakdown</span>
              </div>
              <DonutChart categories={CATEGORIES} size={130} />
            </div>

            {/* Category rows */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {visibleCats.map((cat, i) => {
                const p     = pct(cat.value, cat.budget);
                const over  = cat.value > cat.budget;
                return (
                  <motion.div key={i}
                    initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay: 0.2 + i*0.06 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, alignItems:"center" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontSize:14 }}>{cat.icon}</span>
                        <span style={{ fontSize:12, color:"rgba(255,255,255,0.8)" }}>{cat.name}</span>
                        {over && (
                          <span style={{
                            fontSize:8, padding:"1px 5px", borderRadius:99,
                            background:"rgba(248,113,113,0.15)", color:"#F87171",
                            border:"1px solid rgba(248,113,113,0.3)", letterSpacing:"0.08em",
                          }}>OVER</span>
                        )}
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <span style={{ fontSize:12, fontWeight:600, color: over ? "#F87171" : "#F9E27E" }}>
                          {fmt(cat.value)}
                        </span>
                        <span style={{ fontSize:10, color:"rgba(255,255,255,0.25)", marginLeft:4 }}>
                          / {fmt(cat.budget)}
                        </span>
                      </div>
                    </div>
                    {/* Budget bar */}
                    <div style={{ height:5, background:"rgba(255,255,255,0.06)", borderRadius:99, overflow:"hidden" }}>
                      <motion.div
                        initial={{ width:0 }}
                        animate={{ width:`${Math.min(p, 100)}%` }}
                        transition={{ duration:0.8, delay:0.3+i*0.06, ease:"easeOut" }}
                        style={{
                          height:"100%", borderRadius:99,
                          background: over
                            ? "linear-gradient(90deg,#F87171,#EF4444)"
                            : p > 80
                            ? "linear-gradient(90deg,#FCD34D,#D97706)"
                            : `linear-gradient(90deg,${cat.color},${cat.color}99)`,
                          boxShadow: over ? "0 0 6px #F8717166" : "none",
                        }}
                      />
                    </div>
                    <div style={{ fontSize:9, color:"rgba(255,255,255,0.25)", marginTop:3, textAlign:"right" }}>
                      {p}% of budget used
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {CATEGORIES.length > 4 && (
              <button onClick={() => setShowAll(s => !s)}
                style={{
                  alignSelf:"center", background:"transparent",
                  border:"1px solid rgba(212,175,55,0.25)", borderRadius:99,
                  color:"#D4AF37", fontSize:11, padding:"5px 14px", cursor:"pointer",
                  display:"flex", alignItems:"center", gap:4,
                }}>
                {showAll ? "Show less" : `+${CATEGORIES.length-4} more`}
                <ChevronDown size={12} style={{ transform: showAll ? "rotate(180deg)":"none", transition:"0.2s" }} />
              </button>
            )}
          </motion.div>

          {/* ── TREND CHART (right-top) ── */}
          <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }}
            transition={{ delay:0.2 }}
            style={{
              background:"rgba(255,255,255,0.03)", border:"1px solid rgba(212,175,55,0.12)",
              borderRadius:18, padding:"18px 20px", backdropFilter:"blur(12px)",
            }}>
            {/* Tab toggle */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, color:"#D4AF37" }}>
                <Activity size={15} />
                <span style={{ fontSize:12, fontWeight:600, letterSpacing:"0.08em" }}>Spending Trend</span>
              </div>
              <div style={{ display:"flex", gap:4 }}>
                {["weekly","monthly"].map(t => (
                  <button key={t} onClick={() => setChartTab(t)}
                    style={{
                      fontSize:9, padding:"3px 10px", borderRadius:99, cursor:"pointer",
                      letterSpacing:"0.08em", textTransform:"uppercase",
                      background: chartTab===t ? "rgba(212,175,55,0.2)" : "transparent",
                      border: `1px solid ${chartTab===t ? "rgba(212,175,55,0.5)" : "rgba(255,255,255,0.1)"}`,
                      color: chartTab===t ? "#D4AF37" : "rgba(255,255,255,0.35)",
                    }}>{t}</button>
                ))}
              </div>
            </div>

            {chartTab === "weekly" && (
              <>
                {/* Week selector */}
                <div style={{ display:"flex", gap:6, marginBottom:12 }}>
                  {Object.keys(WEEKLY_DATA).map(w => (
                    <button key={w} onClick={() => setWeekSel(w)}
                      style={{
                        fontSize:9, padding:"2px 8px", borderRadius:99, cursor:"pointer",
                        background: weekSel===w ? "rgba(249,226,126,0.15)" : "transparent",
                        border:`1px solid ${weekSel===w ? "rgba(249,226,126,0.4)" : "rgba(255,255,255,0.08)"}`,
                        color: weekSel===w ? "#F9E27E" : "rgba(255,255,255,0.3)",
                      }}>{w}</button>
                  ))}
                </div>

                <LineChart
                  datasets={{ [weekSel]: WEEKLY_DATA[weekSel], "Last Week": WEEKLY_DATA["Last Week"] }}
                  labels={DAYS} height={100} />

                {/* Legend */}
                <div style={{ display:"flex", gap:12, marginTop:8 }}>
                  {[["This Week","#F9E27E","solid"],["Last Week","#D4AF3766","dashed"]].map(([l,c,s]) => (
                    <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <div style={{ width:20, height:1.5,
                        background: s==="dashed" ? `repeating-linear-gradient(90deg,${c} 0,${c} 4px,transparent 4px,transparent 7px)` : c,
                      }} />
                      <span style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>{l}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {chartTab === "monthly" && (
              <BarChart data={MONTHLY_DATA} labels={MONTHS} height={110} />
            )}
          </motion.div>

          {/* ── ANOMALY / ALERTS (right-bottom) ── */}
          <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }}
            transition={{ delay:0.25 }}
            style={{
              background:"rgba(255,255,255,0.03)", border:"1px solid rgba(212,175,55,0.12)",
              borderRadius:18, padding:"18px 20px", backdropFilter:"blur(12px)",
            }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, color:"#F87171", marginBottom:14 }}>
              <AlertTriangle size={15} />
              <span style={{ fontSize:12, fontWeight:600, letterSpacing:"0.08em" }}>
                Anomaly Detection
              </span>
              {anomalies.length > 0 && (
                <span style={{
                  position:"relative", width:16, height:16, display:"flex",
                  alignItems:"center", justifyContent:"center",
                }}>
                  <span style={{
                    position:"absolute", inset:0, borderRadius:"50%",
                    background:"#F87171", animation:"ins-pulse-ring 1.5s ease-out infinite",
                  }} />
                  <span style={{
                    position:"relative", width:8, height:8, borderRadius:"50%",
                    background:"#F87171", display:"inline-block",
                  }} />
                </span>
              )}
            </div>

            {anomalies.length === 0 ? (
              <div style={{ textAlign:"center", padding:"20px 0", color:"rgba(255,255,255,0.3)", fontSize:12 }}>
                ✓ All categories within budget
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {anomalies.map((cat, i) => {
                  const over = cat.value - cat.budget;
                  const ovPct = pct(over, cat.budget);
                  return (
                    <motion.div key={i}
                      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                      transition={{ delay:0.3+i*0.07 }}
                      style={{
                        background:"rgba(248,113,113,0.06)",
                        border:"1px solid rgba(248,113,113,0.18)",
                        borderRadius:10, padding:"10px 12px",
                        display:"flex", justifyContent:"space-between", alignItems:"center",
                      }}>
                      <div>
                        <div style={{ fontSize:12, display:"flex", alignItems:"center", gap:5 }}>
                          <span>{cat.icon}</span>
                          <span style={{ color:"rgba(255,255,255,0.8)" }}>{cat.name}</span>
                        </div>
                        <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginTop:2 }}>
                          Budget: {fmt(cat.budget)}
                        </div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:13, fontWeight:600, color:"#F87171" }}>+{fmt(over)}</div>
                        <div style={{ fontSize:9, color:"#F8717199" }}>{ovPct}% over</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Savings tip */}
            {savingsPotential > 0 && (
              <div style={{
                marginTop:12, padding:"9px 12px",
                background:"rgba(212,175,55,0.07)",
                border:"1px solid rgba(212,175,55,0.2)",
                borderRadius:10, fontSize:11, color:"rgba(255,255,255,0.5)",
                lineHeight:1.5,
              }}>
                💡 Trim overspending to save <span style={{ color:"#D4AF37", fontWeight:600 }}>{fmt(savingsPotential)}</span> this cycle.
              </div>
            )}
          </motion.div>
        </div>

        {/* ── GOLDEN RATIO BAR (full width) ── */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.3 }}
          style={{
            background:"rgba(255,255,255,0.03)", border:"1px solid rgba(212,175,55,0.12)",
            borderRadius:18, padding:"18px 20px", backdropFilter:"blur(12px)", marginBottom:16,
          }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, color:"#D4AF37" }}>
              <Zap size={15} />
              <span style={{ fontSize:12, fontWeight:600, letterSpacing:"0.08em" }}>50 / 30 / 20 Rule</span>
            </div>
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>Needs · Wants · Savings</span>
          </div>

          {(() => {
            const needs   = CATEGORIES.filter(c=>["Rent","Food","Health"].includes(c.name)).reduce((s,c)=>s+c.value,0);
            const wants   = CATEGORIES.filter(c=>["Entertainment","Shopping"].includes(c.name)).reduce((s,c)=>s+c.value,0);
            const travel  = CATEGORIES.find(c=>c.name==="Travel").value;
            const idealNeeds  = total * 0.50;
            const idealWants  = total * 0.30;
            const idealSavings= total * 0.20;
            const segments = [
              { label:"Needs",   value:needs,  ideal:idealNeeds,  color:"#D4AF37", idealColor:"#D4AF3744" },
              { label:"Wants",   value:wants+travel, ideal:idealWants,  color:"#F9E27E", idealColor:"#F9E27E44" },
              { label:"Savings", value:0,       ideal:idealSavings, color:"#6EE7B7", idealColor:"#6EE7B744" },
            ];
            return (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {/* Stacked bar */}
                <div style={{ display:"flex", height:28, borderRadius:8, overflow:"hidden", gap:2 }}>
                  {segments.map((s,i) => {
                    const w = (s.value / total) * 100;
                    return (
                      <motion.div key={i}
                        initial={{ width:0 }}
                        animate={{ width:`${w}%` }}
                        transition={{ duration:0.9, delay:0.4+i*0.1, ease:"easeOut" }}
                        title={`${s.label}: ${fmt(s.value)}`}
                        style={{
                          height:"100%", background:s.color,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:10, fontWeight:600, color:"#0a0a0f",
                          overflow:"hidden", whiteSpace:"nowrap", minWidth:0,
                        }}>
                        {w > 8 ? `${Math.round(w)}%` : ""}
                      </motion.div>
                    );
                  })}
                </div>
                {/* Ideal vs actual */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                  {segments.map((s,i) => {
                    const actualPct = Math.round((s.value / total) * 100);
                    const idealPct  = Math.round((s.ideal / total) * 100);
                    const diff      = actualPct - idealPct;
                    return (
                      <div key={i} style={{
                        background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"10px 12px",
                        border:`1px solid ${s.color}22`,
                      }}>
                        <div style={{ fontSize:10, color:s.color, marginBottom:4, letterSpacing:"0.08em" }}>
                          {s.label}
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                          <span style={{ fontSize:18, fontWeight:700, color:"#fff", fontFamily:"'Cormorant Garamond',serif" }}>
                            {actualPct}%
                          </span>
                          <span style={{ fontSize:10, color: diff>0 ? "#F87171" : diff<0 ? "#6EE7B7" : "#888" }}>
                            {diff > 0 ? `+${diff}%` : diff < 0 ? `${diff}%` : "✓"} vs ideal
                          </span>
                        </div>
                        <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)" }}>
                          {fmt(s.value)} · ideal {idealPct}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </motion.div>

      </div>{/* end content wrapper */}

      {/* ── ORACLE BAR ── */}
      <div style={{
        position:   "sticky", bottom:0, width:"100%",
        background: "rgba(8,8,16,0.9)", backdropFilter:"blur(12px)",
        borderTop:  "1px solid rgba(212,175,55,0.15)",
        padding:    "10px 0", overflow:"hidden", zIndex:10,
      }}>
        <div style={{
          display:        "inline-block",
          whiteSpace:     "nowrap",
          animation:      "ins-marquee 22s linear infinite",
          color:          "#F9E27E",
          fontSize:       12,
          letterSpacing:  "0.06em",
          paddingLeft:    "100vw",
        }}>
          {anomalies.length > 0
            ? `✨ ${anomalies.map(a=>`${a.icon} ${a.name} is ₹${(a.value-a.budget).toLocaleString("en-IN")} over budget`).join("  ·  ")}  ·  💡 Tip: reducing wants by 10% saves you ${fmt(total*0.03)} monthly ✨`
            : "✨ All categories within budget · You're on track for a prosperous cycle · Keep the momentum ✨"
          }
        </div>
      </div>

    </div>
  );
}
