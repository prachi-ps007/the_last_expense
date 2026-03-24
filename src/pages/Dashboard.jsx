import React, { useEffect, useState } from "react";

function Dashboard() {
  const fullText = "A Penny Saved Is A Penny Earned";
  const [text, setText] = useState("");

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
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-950 to-indigo-950 relative overflow-hidden">
      
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

      {/* ✨ CENTER TYPEWRITER TEXT */}
      <div className="absolute inset-0 flex justify-center items-center z-10">
        <h2
          style={{ fontFamily: "'Parisienne', cursive" }}
          className="text-5xl md:text-7xl lg:text-8xl text-center tracking-[0.3em] text-indigo-200 drop-shadow-[0_0_12px_rgba(129,140,248,0.9)]"
        >
          {text}
          <span className="animate-blink">|</span>
        </h2>
      </div>

      {/* 🌌 Bottom Content */}
      <div className="relative z-10 mt-[70vh] px-6">
        <h1
          style={{ fontFamily: "Amatic SC, cursive" }}
          className="text-center text-white text-4xl mb-8"
        >
          🌌 Financial Universe
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-slate-800 p-4 rounded-2xl shadow-lg">
            <h2>Total Income</h2>
            <p className="text-green-400 text-xl">₹0</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-2xl shadow-lg">
            <h2>Total Expenses</h2>
            <p className="text-red-400 text-xl">₹0</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-2xl shadow-lg">
            <h2>Balance</h2>
            <p className="text-blue-400 text-xl">₹0</p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;