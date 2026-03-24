import React, { useState } from "react";
import { motion } from "framer-motion";

function CloudOverlay({ children }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="relative mb-10">
      
      {/* 🌥 CLOUD LAYER */}
      {!revealed && (
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: revealed ? "-120%" : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          onClick={() => setRevealed(true)}
          className="absolute inset-0 z-20 cursor-pointer"
        >
          {/* Sky Background */}
          <div className="w-full h-full bg-gradient-to-b from-sky-300 via-blue-300 to-blue-400 rounded-3xl overflow-hidden relative">
            
            {/* ☁️ Clouds */}
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-40 h-20 bg-white/80 rounded-full blur-xl"></div>
              <div className="absolute top-20 right-20 w-52 h-24 bg-white/70 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 left-1/3 w-60 h-28 bg-white/60 rounded-full blur-xl"></div>
              <div className="absolute bottom-20 right-10 w-40 h-20 bg-white/70 rounded-full blur-xl"></div>
            </div>

            {/* ✨ Hint Text */}
            <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-semibold">
              ☁️ Tap to reveal your finances
            </div>
          </div>
        </motion.div>
      )}

      {/* 📊 ACTUAL CONTENT */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default CloudOverlay;