import React, { useEffect, useState } from "react";
import { Rocket } from "lucide-react";

function Dashboard() {
  const fullText = "A Penny Saved Is A Penny Earned";
  const [text, setText] = useState("");

  // Demo values (replace later)
  const velocity = 1200;
  const progress = 65;

  useEffect(() => {
    let index = 0;

    const startTyping = () => {
      const interval = setInterval(() => {
        setText(fullText.slice(0, index + 1));
        index++;

        if (index === fullText.length) {
          clearInterval(interval);
        }
      }, 80);
    };

    const delay = setTimeout(startTyping, 500);
    return () => clearTimeout(delay);
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-black via-slate-950 to-black relative overflow-hidden">

      {/* 🌟 Starfield */}
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

      {/* ✨ TYPEWRITER SECTION */}
      <div className="flex justify-center items-center min-h-[70vh] relative z-10">
        <h2
          style={{ fontFamily: "Amatic SC, cursive" }}
          className="text-4xl md:text-7xl font-extrabold text-center tracking-[0.3em] text-slate-200"
        >
          {text}
          <span className="animate-blink">|</span>
        </h2>
      </div>

      {/* 🚀 Wealth Velocity BELOW QUOTE */}
      <div className="relative z-10 px-6 mt-10">
        <div className="max-w-xl mx-auto mb-16 p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_0_40px_rgba(212,175,55,0.15)]">

          <h2 className="text-center text-sm tracking-[0.3em] text-[#D4AF37]/80 uppercase mb-6">
            Wealth Velocity
          </h2>

          {/* Gauge */}
          <div className="relative w-52 h-52 mx-auto">
            <svg className="w-full h-full rotate-[-90deg]">

              {/* Background */}
              <circle
                cx="104"
                cy="104"
                r="90"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="10"
                fill="transparent"
              />

              {/* Progress */}
              <circle
                cx="104"
                cy="104"
                r="90"
                stroke="#D4AF37"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 90}
                strokeDashoffset={(2 * Math.PI * 90) * (1 - progress / 100)}
                strokeLinecap="round"
                className="transition-all duration-700 drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]"
              />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">

              <div className="flex items-center gap-2 mb-2">
                <Rocket className="text-[#D4AF37] animate-pulse" size={18} />
                <span className="text-xs text-white/50 tracking-wide">
                  Momentum
                </span>
              </div>

              <p className="text-3xl font-light text-white">
                ₹{velocity}/day
              </p>

              <p className="text-xs text-white/50 mt-1">
                {progress}% of monthly target
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🌌 Financial Cards */}
      <div className="relative z-10 px-6 pb-20">

        <h1
          style={{ fontFamily: "Amatic SC, cursive" }}
          className="text-center text-white text-4xl mb-8"
        >
            Financial Universe
        </h1>


      </div>
    </div>
  );
}

export default Dashboard;


/* Add this in index.css if not already present
.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  opacity: 0.8;
  animation: twinkle 3s infinite ease-in-out;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}
*/