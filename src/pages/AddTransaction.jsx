// ✅ FINAL UPDATED AddTransactionPage.jsx (FUNCTIONAL + CROSSWALK DESIGN)
import React, { useState, useContext } from "react";
import { DollarSign, Tag, FileText } from "lucide-react";
import { FinanceContext } from "../context/FinanceContext";
import { useNavigate } from "react-router-dom";

export default function AddTransaction() {
  const { addTransaction } = useContext(FinanceContext);
  const navigate = useNavigate();

  const [focused, setFocused] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    if (!amount || !category) return;

    addTransaction({
      title: category,
      amount: Number(amount),
      category,
      notes: note,
      type: "expense",
      date: new Date().toISOString(),
    });

    navigate("/transactions");
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans">

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_4fr_2fr] min-h-screen">

        {/* LEFT CROSSWALK */}
        <div className="hidden md:block relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom,#facc15 0px,#facc15 50px,transparent 50px,transparent 100px)`,
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(#00000022_1px,transparent_1px)] bg-[size:4px_4px] opacity-40" />
        </div>

        {/* CENTER */}
        <div className="flex flex-col items-center justify-center px-6 py-16">

          <h1 className="text-5xl md:text-6xl py-4 font-black text-center mb-16 uppercase tracking-tight">
            Add Transaction
          </h1>

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
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
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
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-900 text-lg"
                  onFocus={() => setFocused("note")}
                  onBlur={() => setFocused("")}
                />
              </div>
            </div>

            {/* Active Line */}
            {focused && (
              <div className="h-1 bg-yellow-400 animate-pulse rounded-full"></div>
            )}

            {/* Button */}
            <button
              onClick={handleSubmit}
              className="mt-6 w-full py-6 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest rounded-2xl transition-all text-lg"
            >
              Add Transaction
            </button>
          </div>
        </div>

        {/* RIGHT CROSSWALK */}
        <div className="hidden md:block relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom,#facc15 0px,#facc15 50px,transparent 50px,transparent 100px)`,
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(#00000022_1px,transparent_1px)] bg-[size:4px_4px] opacity-40" />
        </div>

      </div>
    </div>
  );
}


// ✅ RESULT
// ✔ Same BEAUTIFUL UI (floating labels + crosswalk)
// ✔ Fully functional form
// ✔ Saves to context + localStorage
// ✔ Redirects to transactions page
// ✔ Clean UX + animations 🚀