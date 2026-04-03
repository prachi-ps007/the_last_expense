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
  const [type, setType] = useState("expense"); // ✅ NEW

  const handleSubmit = () => {
    if (!amount || !category) return;

    addTransaction({
      title: category,
      amount: Number(amount),
      category,
      notes: note,
      type: type, // ✅ USE SELECTED TYPE
      date: new Date().toISOString(),
    });

    // optional reset
    setAmount("");
    setCategory("");
    setNote("");

    navigate("/transactions");
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_4fr_2fr] min-h-screen">

        {/* LEFT DESIGN */}
        <div className="hidden md:block relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom,#facc15 0px,#facc15 50px,transparent 50px,transparent 100px)`,
            }}
          />
        </div>

        {/* CENTER */}
        <div className="flex flex-col items-center justify-center px-6 py-16">
          <h1 className="text-5xl font-black mb-12 uppercase">
            Add Transaction
          </h1>

          <div className="w-full md:w-[80%] flex flex-col gap-8">
            <br></br>

            {/* ✅ TYPE TOGGLE */}
            <div className="flex rounded-2xl overflow-hidden border border-white/10">
              <button
                onClick={() => setType("expense")}
                className={`flex-1 py-3 font-bold transition ${
                  type === "expense"
                    ? "bg-red-500 text-white"
                    : "bg-white/10 text-white/60"
                }`}
              >
                Expense
              </button>

              <button
                onClick={() => setType("income")}
                className={`flex-1 py-3 font-bold transition ${
                  type === "income"
                    ? "bg-emerald-500 text-white"
                    : "bg-white/10 text-white/60"
                }`}
              >
                Income
              </button>
            </div>

            {/* Amount */}
            <div className="bg-white/80 px-6 py-6 rounded-2xl relative">
              <label
                className={`absolute left-6 transition ${
                  focused === "amount"
                    ? "-translate-y-6 text-green-600 text-xs"
                    : "top-7"
                }`}
              >
                Amount
              </label>
              <div className="flex items-center gap-4">
                <DollarSign />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent outline-none text-black"
                  onFocus={() => setFocused("amount")}
                  onBlur={() => setFocused("")}
                />
              </div>
            </div>

            {/* Category */}
            <div className="bg-white/80 px-6 py-6 rounded-2xl relative">
              <label
                className={`absolute left-6 transition ${
                  focused === "category"
                    ? "-translate-y-6 text-green-600 text-xs"
                    : "top-7"
                }`}
              >
                Category
              </label>
              <div className="flex items-center gap-4">
                <Tag />
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-transparent outline-none text-black"
                  onFocus={() => setFocused("category")}
                  onBlur={() => setFocused("")}
                />
              </div>
            </div>

            {/* Note */}
            <div className="bg-white/80 px-6 py-6 rounded-2xl relative">
              <label
                className={`absolute left-6 transition ${
                  focused === "note"
                    ? "-translate-y-6 text-green-600 text-xs"
                    : "top-7"
                }`}
              >
                Note
              </label>
              <div className="flex items-center gap-4">
                <FileText />
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-transparent outline-none text-black"
                  onFocus={() => setFocused("note")}
                  onBlur={() => setFocused("")}
                />
              </div>
            </div>

            {/* Button */}
            <button
              onClick={handleSubmit}
              className="mt-6 w-full py-4 bg-green-500 hover:bg-green-600 rounded-2xl font-bold"
            >
              Add Transaction
            </button>
          </div>
        </div>

        {/* RIGHT DESIGN */}
        <div className="hidden md:block relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom,#facc15 0px,#facc15 50px,transparent 50px,transparent 100px)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}