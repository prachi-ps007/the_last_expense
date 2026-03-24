import React, { useState } from "react";
import { DollarSign, Tag, FileText } from "lucide-react";

export default function AddTransactionPage() {
  const [focused, setFocused] = useState("");

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans">

      {/* Navigation */}
      <nav className="flex justify-center gap-12 py-6 border-b border-white/10">
        {["Dashboard", "Transactions", "Analytics"].map((item) => (
          <span
            key={item}
            className="text-sm tracking-widest uppercase text-white/60 hover:text-green-400 cursor-pointer transition"
          >
            {item}
          </span>
        ))}
      </nav>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_4fr_2fr] min-h-[calc(100vh-88px)]">

        {/* LEFT CROSSWALK */}
        <div className="hidden md:block relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  to bottom,
                  #facc15 0px,
                  #facc15 50px,
                  transparent 50px,
                  transparent 100px
                )
              `,
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(#00000022_1px,transparent_1px)] bg-[size:4px_4px] opacity-40" />
        </div>

        {/* CENTER CONTENT */}
        <div className="flex flex-col items-center justify-center px-6 py-16">

          {/* Title */}
          <h1 className="text-5xl md:text-6xl py-4 font-black text-center mb-16 uppercase tracking-tight">
            Add Transaction
          </h1>

          {/* FORM */}
          <div className="w-full md:w-[80%] flex flex-col gap-8">

            {/* Amount */}
            <div className="bg-white/80 backdrop-blur-xl px-6 py-6 rounded-2xl shadow-lg relative">
              <label
                className={`absolute left-6 transition-all duration-300 text-slate-500 ${
                  focused === "amount"
                    ? "-translate-y-6 text-green-600 text-xs"
                    : "top-7"
                }`}
              >
                Amount
              </label>
              <div className="flex items-center gap-4">
                <DollarSign className="text-slate-400" />
                <input
                  type="number"
                  className="w-full bg-transparent outline-none text-slate-900 text-lg"
                  onFocus={() => setFocused("amount")}
                  onBlur={() => setFocused("")}
                />
              </div>
            </div>

            {/* Category */}
            <div className="bg-white/80 backdrop-blur-xl px-6 py-6 rounded-2xl shadow-lg relative">
              <label
                className={`absolute left-6 transition-all duration-300 text-slate-500 ${
                  focused === "category"
                    ? "-translate-y-6 text-green-600 text-xs"
                    : "top-7"
                }`}
              >
                Category
              </label>
              <div className="flex items-center gap-4">
                <Tag className="text-slate-400" />
                <input
                  type="text"
                  className="w-full bg-transparent outline-none text-slate-900 text-lg"
                  onFocus={() => setFocused("category")}
                  onBlur={() => setFocused("")}
                />
              </div>
            </div>

            {/* Note */}
            <div className="bg-white/80 backdrop-blur-xl px-6 py-6 rounded-2xl shadow-lg relative">
              <label
                className={`absolute left-6 transition-all duration-300 text-slate-500 ${
                  focused === "note"
                    ? "-translate-y-6 text-green-600 text-xs"
                    : "top-7"
                }`}
              >
                Note
              </label>
              <div className="flex items-center gap-4">
                <FileText className="text-slate-400" />
                <input
                  type="text"
                  className="w-full bg-transparent outline-none text-slate-900 text-lg"
                  onFocus={() => setFocused("note")}
                  onBlur={() => setFocused("")}
                />
              </div>
            </div>

            {/* Active Stripe Indicator */}
            {focused && (
              <div className="h-1 bg-yellow-400 animate-pulse rounded-full"></div>
            )}

            {/* Button */}
            <button className="mt-6 w-full py-6 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest rounded-2xl transition-all text-lg">
              Add Transaction
            </button>
          </div>
        </div>

        {/* RIGHT CROSSWALK */}
        <div className="hidden md:block relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  to bottom,
                  #facc15 0px,
                  #facc15 50px,
                  transparent 50px,
                  transparent 100px
                )
              `,
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(#00000022_1px,transparent_1px)] bg-[size:4px_4px] opacity-40" />
        </div>

      </div>
    </div>
  );
}