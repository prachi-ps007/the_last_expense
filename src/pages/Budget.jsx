import React, { useEffect, useState } from "react";
import { Flower2, CloudRain } from "lucide-react";

function BudgetGarden({ budgetLimit = 10000, currentSpending = 6500 }) {
  const [weather, setWeather] = useState("blooming");

  const spentPercent = (currentSpending / budgetLimit) * 100;
  const remaining = budgetLimit - currentSpending;

  useEffect(() => {
    if (spentPercent > 90) {
      setWeather("withering");
    } else {
      setWeather("blooming");
    }
  }, [spentPercent]);

  return (
    <div
      className={`min-h-screen p-8 transition-all duration-700 relative overflow-hidden ${
        weather === "blooming"
          ? "bg-gradient-to-b from-sky-200 to-blue-400"
          : "bg-gradient-to-b from-gray-700 to-gray-900"
      }`}
    >

      {/* ☀️ Sun Glow */}
      {weather === "blooming" && (
        <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-60"></div>
      )}

      {/* 🌧 Rain Overlay */}
      {weather === "withering" && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <span
              key={i}
              className="rain"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 🌸 Garden */}
      <div className="flex justify-center gap-10 mt-20">
        {[...Array(5)].map((_, i) => (
          <Flower2
            key={i}
            size={60}
            className={`transition-all duration-700 drop-shadow-md ${
              weather === "blooming"
                ? "text-pink-500"
                : "text-gray-400 rotate-45"
            }`}
          />
        ))}
      </div>

      {/* 💧 Watering Can Progress */}
      <div className="max-w-xl mx-auto mt-20 p-6 rounded-3xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-lg">

        <h2 className="text-center text-lg font-light tracking-wide text-white mb-4">
          Budget Health
        </h2>

        <div className="w-full bg-white/20 h-4 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-300 to-emerald-500 transition-all duration-700"
            style={{ width: `${100 - spentPercent}%` }}
          ></div>
        </div>

        <div className="flex justify-between mt-3 text-sm text-white/80">
          <span>Remaining: ₹{remaining}</span>
          <span>{Math.round(100 - spentPercent)}% left</span>
        </div>
      </div>

      {/* 🌼 Title */}
      <h1 className="text-center text-3xl text-white mt-16 font-light tracking-widest">
        Budget Garden
      </h1>
    </div>
  );
}

export default BudgetGarden;



