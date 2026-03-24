import React, { useEffect, useRef, useState } from "react";
import { Flower2 } from "lucide-react";

const FLOWER_COUNT = 7;

const THEMES = {
  blooming: {
    skyFrom: "#38bdf8",
    skyTo: "#4338ca",
    groundFrom: "#14532d",
    groundTo: "#052e16",
    sunColor: "#FDD835",
    sunGlow: "rgba(253,216,53,0.5)",
    barGradient: "linear-gradient(90deg,#6EE7B7,#10B981)",
    horizonColor: "rgba(134,239,172,0.6)",
    horizonGlow: "0 0 18px 6px rgba(134,239,172,0.3)",
    label: "Thriving 🌸",
    labelColor: "#6EE7B7",
    flowerColors: ["#FACC15","#F472B6","#FB923C","#A78BFA","#34D399","#F87171","#60A5FA"],
    flowerGlow: true,
    hasSun: true,
    hasClouds: true,
    hasRain: false,
  },
  warning: {
    skyFrom: "#FCD34D",
    skyTo: "#C2410C",
    groundFrom: "#92400E",
    groundTo: "#1C0A00",
    sunColor: "#FB923C",
    sunGlow: "rgba(251,146,60,0.4)",
    barGradient: "linear-gradient(90deg,#FCD34D,#D97706)",
    horizonColor: "rgba(252,211,77,0.45)",
    horizonGlow: "none",
    label: "Caution 🍂",
    labelColor: "#FCD34D",
    flowerColors: Array(7).fill("#FDE68A"),
    flowerGlow: false,
    hasSun: true,
    hasClouds: true,
    hasRain: false,
  },
  storm: {
    skyFrom: "#475569",
    skyTo: "#0F172A",
    groundFrom: "#292524",
    groundTo: "#0C0A09",
    sunColor: null,
    sunGlow: null,
    barGradient: "linear-gradient(90deg,#FDA4AF,#F43F5E)",
    horizonColor: "rgba(100,116,139,0.2)",
    horizonGlow: "none",
    label: "Critical ⚡",
    labelColor: "#F87171",
    flowerColors: Array(7).fill("#64748B"),
    flowerGlow: false,
    hasSun: false,
    hasClouds: false,
    hasRain: true, // Switched to true for the storm feel
  },
  over: {
    skyFrom: "#1E293B",
    skyTo: "#000000",
    groundFrom: "#18181B",
    groundTo: "#000000",
    sunColor: null,
    sunGlow: null,
    barGradient: "linear-gradient(90deg,#4B5563,#1F2937)",
    horizonColor: "rgba(71,85,105,0.15)",
    horizonGlow: "none",
    label: "Overspent 🌧",
    labelColor: "#EF4444",
    flowerColors: Array(7).fill("#374151"),
    flowerGlow: false,
    hasSun: false,
    hasClouds: false,
    hasRain: true,
  },
};

export default function Budget({ budgetLimit = 10000, currentSpending = 6500 }) {
  const spentPct = Math.min((currentSpending / budgetLimit) * 100, 100);
  const remainingPct = Math.max(100 - spentPct, 0);
  const remaining = budgetLimit - currentSpending;

  const getState = () => {
    if (remainingPct <= 0) return "over";
    if (remainingPct < 20) return "storm";
    if (remainingPct <= 50) return "warning";
    return "blooming";
  };

  const [state, setState] = useState(getState);
  useEffect(() => setState(getState()), [remainingPct]);

  const theme = THEMES[state];
  const wilted = state === "over" || state === "storm";

  const rain = useRef(
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${(i * 1.27 + 1.5) % 100}%`,
      delay: `${((i * 41) % 210) / 100}s`,
      dur: `${0.5 + (i % 9) * 0.07}s`,
    }))
  ).current;

  const clouds = useRef([
    { id: 1, top: "7%", w: 200, h: 75, blur: 14, op: 0.72, dur: "30s", delay: "0s" },
    { id: 2, top: "15%", w: 145, h: 55, blur: 11, op: 0.48, dur: "44s", delay: "12s" },
    { id: 3, top: "3%", w: 260, h: 100, blur: 20, op: 0.38, dur: "55s", delay: "24s" },
  ]).current;

  return (
    <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100vh", // FORCED FULL HEIGHT
        width: "100%",
        overflow: "hidden" 
    }}>
      <style>{`
        @keyframes bg-rain {
          0% { transform:translateY(-30px); opacity:0; }
          8% { opacity:1; }
          100% { transform:translateY(100vh); opacity:0.6; }
        }
        @keyframes bg-sway {
          0%,100% { transform:rotate(-5deg); }
          50% { transform:rotate(5deg); }
        }
        @keyframes bg-wilt {
          to { transform:rotate(58deg) scaleY(0.62); }
        }
        @keyframes bg-cloud {
          from { transform:translateX(-15%); }
          to { transform:translateX(120vw); }
        }
        @keyframes bg-sun {
          0%,100% { transform:scale(1); opacity:.9; }
          50% { transform:scale(1.07); opacity:1; }
        }
        @keyframes bg-shimmer {
          0% { background-position:-200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: "100%", // ENSURES INTERNAL WRAPPER FILLS PARENT
        overflow: "hidden",
      }}>

        {/* LAYER 0: SKY */}
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: `linear-gradient(to bottom, ${theme.skyFrom}, ${theme.skyTo})`,
          transition: "background 1.5s ease",
        }} />

        {/* LAYER 1: CLOUDS */}
        {theme.hasClouds && clouds.map(c => (
          <div key={c.id} style={{
            position: "absolute",
            top: c.top,
            left: "-20%",
            zIndex: 1,
            width: c.w,
            height: c.h,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.88)",
            filter: `blur(${c.blur}px)`,
            opacity: c.op,
            animation: `bg-cloud ${c.dur} linear ${c.delay} infinite`,
            pointerEvents: "none",
          }} />
        ))}

        {/* LAYER 1: SUN */}
        {theme.hasSun && (
          <div style={{
            position: "absolute",
            top: "10%",
            right: "8%",
            zIndex: 1,
            width: 84,
            height: 84,
            borderRadius: "50%",
            background: `radial-gradient(circle at 38% 38%, ${theme.sunColor} 32%, ${theme.sunColor}44 62%, transparent 76%)`,
            boxShadow: `0 0 32px 16px ${theme.sunGlow}`,
            animation: "bg-sun 4s ease-in-out infinite",
            pointerEvents: "none",
          }} />
        )}

        {/* LAYER 2: RAIN */}
        {theme.hasRain && rain.map(r => (
          <div key={r.id} style={{
            position: "absolute",
            top: -30,
            left: r.left,
            zIndex: 2,
            width: 1.5,
            height: 22,
            borderRadius: 3,
            background: "linear-gradient(to bottom, transparent, rgba(147,197,253,0.85))",
            animation: `bg-rain ${r.dur} linear ${r.delay} infinite`,
            pointerEvents: "none",
          }} />
        ))}

        {/* FLEX BODY */}
        <div style={{
          position: "relative",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}>

          {/* BUDGET CARD */}
          <div style={{
            flex: "0 0 auto",
            display: "flex",
            justifyContent: "center",
            padding: "222px ",
            zIndex: 10,
          }}>
            <div style={{
              backdropFilter: "blur(22px)",
              WebkitBackdropFilter: "blur(22px)",
              background: "rgba(255,255,255,0.13)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 22,
              padding: "22px 28px",
              maxWidth: 720,
              height: 160,
              width: "100%",
              boxShadow: "0 8px 40px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <span style={{ color:"rgba(255,255,255,0.8)", fontSize:20, letterSpacing:"0.2em", textTransform:"uppercase", fontWeight:600 }}>
                  Budget Health
                </span>
                <span style={{ color:theme.labelColor, fontSize:11, fontWeight:700, letterSpacing:"0.08em" }}>
                  {theme.label}
                </span>
              </div>

              <div style={{ width:"100%", height:11, background:"rgba(255,255,255,0.15)", borderRadius:99, overflow:"hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${remainingPct}%`,
                  background: theme.barGradient,
                  backgroundSize: "200% 100%",
                  borderRadius: 99,
                  animation: "bg-shimmer 2.5s linear infinite",
                  transition: "width 1.2s cubic-bezier(.4,0,.2,1)",
                }} />
              </div>

              <div style={{ display:"flex", justifyContent:"space-between", marginTop:14 }}>
                {[
                  ["Remaining", `₹${remaining.toLocaleString("en-IN")}`],
                  ["Spent", `₹${currentSpending.toLocaleString("en-IN")}`],
                  ["Limit", `₹${budgetLimit.toLocaleString("en-IN")}`],
                ].map(([label, value]) => (
                  <div key={label} style={{ textAlign:"center" }}>
                    <div style={{ color:"rgba(255,255,255,0.4)", fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:4 }}>
                      {label}
                    </div>
                    <div style={{ color:"#fff", fontSize:14, fontWeight:600 }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* GARDEN SECTION */}
          <div style={{ position: "relative", width: "100%" }}>
            <div style={{
              width: "100%",
              height: 2,
              background: theme.horizonColor,
              boxShadow: theme.horizonGlow,
            }} />

            {/* Flowers */}
            <div style={{
              position: "absolute",
              bottom: 2,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              gap: 36,
              zIndex: 6,
            }}>
              {Array(FLOWER_COUNT).fill(0).map((_, i) => {
                const color = theme.flowerColors[i % theme.flowerColors.length];
                return (
                  <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                    <div style={{
                      transformOrigin: "bottom center",
                      display: "inline-block",
                      animation: wilted
                        ? `bg-wilt 1.8s ease-out ${i * 0.13}s forwards`
                        : `bg-sway ${2.3 + (i % 4) * 0.4}s ease-in-out ${i * 0.2}s infinite`,
                    }}>
                      <Flower2 size={58} style={{
                        display: "block",
                        color,
                        filter: theme.flowerGlow ? `drop-shadow(0 0 9px ${color}BB)` : "none",
                      }} />
                    </div>
                    <Flower2 size={58} style={{
                      display: "block",
                      color,
                      opacity: 0.12,
                      transform: "scaleY(-1)",
                      marginTop: -4,
                    }} />
                  </div>
                );
              })}
            </div>

            {/* Ground (Fixed Height to ensure stability at bottom) */}
            <div style={{
              width: "100%",
              height: "25vh", // FIXED PROPORTIONAL HEIGHT
              background: `linear-gradient(to bottom, ${theme.groundFrom}, ${theme.groundTo})`,
              transition: "background 1.5s ease",
              zIndex: 5,
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}