import React, { useState } from "react";
import { DollarSign, Tag, FileText } from "lucide-react";

export default function AddTransactionPage() {
  const [focused, setFocused] = useState("");

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Navigation (Street Signs) */}
      <nav className="flex justify-center gap-12 py-6 border-b border-slate-800">
        {["Dashboard", "Transactions", "Analytics"].map((item) => (
          <span
            key={item}
            className="text-sm tracking-widest uppercase text-slate-400 hover:text-white cursor-pointer transition"
          >
            {item}
          </span>
        ))}
      </nav>

      {/* Page Title */}
      <h1 className="text-6xl font-black text-center mt-10 mb-12 uppercase tracking-tight">
        Add Transaction
      </h1>

      {/* Crosswalk Form */}
      <div className="flex flex-col items-center gap-4 px-4">
        {/* Stripe 1 */}
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl px-6 py-5 relative">
          <label
            className={`absolute left-6 transition-all duration-300 text-slate-500 ${
              focused === "amount"
                ? "-translate-y-5 text-indigo-600 text-xs"
                : "top-6"
            }`}
          >
            Amount
          </label>
          <div className="flex items-center gap-3">
            <DollarSign className="text-slate-400" />
            <input
              type="number"
              className="w-full bg-transparent outline-none text-slate-900"
              onFocus={() => setFocused("amount")}
              onBlur={() => setFocused("")}
            />
          </div>
        </div>

        {/* Stripe 2 */}
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl px-6 py-5 relative">
          <label
            className={`absolute left-6 transition-all duration-300 text-slate-500 ${
              focused === "category"
                ? "-translate-y-5 text-indigo-600 text-xs"
                : "top-6"
            }`}
          >
            Category
          </label>
          <div className="flex items-center gap-3">
            <Tag className="text-slate-400" />
            <input
              type="text"
              className="w-full bg-transparent outline-none text-slate-900"
              onFocus={() => setFocused("category")}
              onBlur={() => setFocused("")}
            />
          </div>
        </div>

        {/* Stripe 3 */}
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl px-6 py-5 relative">
          <label
            className={`absolute left-6 transition-all duration-300 text-slate-500 ${
              focused === "note"
                ? "-translate-y-5 text-indigo-600 text-xs"
                : "top-6"
            }`}
          >
            Note
          </label>
          <div className="flex items-center gap-3">
            <FileText className="text-slate-400" />
            <input
              type="text"
              className="w-full bg-transparent outline-none text-slate-900"
              onFocus={() => setFocused("note")}
              onBlur={() => setFocused("")}
            />
          </div>
        </div>

        {/* Stripe Indicator Line */}
        {focused && (
          <div className="w-full max-w-2xl h-1 bg-yellow-400 animate-pulse"></div>
        )}

        {/* Submit Button */}
        <button className="mt-8 w-full max-w-2xl py-4 bg-emerald-600 hover:bg-white hover:text-emerald-600 text-white font-bold uppercase tracking-widest transition-all duration-300 border border-transparent hover:border-emerald-600">
          Add Transaction
        </button>
      </div>
    </div>
  );
}