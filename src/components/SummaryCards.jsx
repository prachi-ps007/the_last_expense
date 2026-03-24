import React from "react";
import { Plus } from "lucide-react";

function SummaryCards({ balance, income, expense }) {
  return (
    <div className="grid grid-cols-12 gap-6 mb-10">

      {/* Total Balance */}
      <div className="col-span-12 h-40 p-6 rounded-3xl bg-white/70 backdrop-blur-lg border border-white/30 shadow-md relative overflow-hidden">

        {/* Sparkline */}
        <svg className="absolute bottom-0 left-0 w-full h-20 opacity-15">
          <polyline
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2"
            points="0,50 40,30 80,40 120,20 160,30 200,10"
          />
        </svg>

        <p className="text-sm text-slate-500">TOTAL BALANCE</p>
        <h2 className="text-3xl font-mono tabular-nums mt-2">
          ₹{balance}
        </h2>

        <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-sky-100">
          <Plus size={16} className="text-slate-400" />
        </button>
      </div>

      {/* Income */}
      <div className="col-span-6 h-40 p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-100 relative overflow-hidden">

        <svg className="absolute bottom-0 left-0 w-full h-20 opacity-15">
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            points="0,60 40,50 80,30 120,20 160,15 200,10"
          />
        </svg>

        <p className="text-sm text-slate-500">INCOME</p>
        <h2 className="text-xl font-mono tabular-nums mt-2 text-emerald-600">
          + ₹{income}
        </h2>

        <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-sky-100">
          <Plus size={16} className="text-slate-400" />
        </button>
      </div>

      {/* Expense */}
      <div className="col-span-6 h-40 p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-100 relative overflow-hidden">

        <svg className="absolute bottom-0 left-0 w-full h-20 opacity-15">
          <polyline
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            points="0,10 40,20 80,40 120,50 160,60 200,70"
          />
        </svg>

        <p className="text-sm text-slate-500">EXPENSES</p>
        <h2 className="text-xl font-mono tabular-nums mt-2 text-red-500">
          - ₹{expense}
        </h2>

        <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-sky-100">
          <Plus size={16} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
}

export default SummaryCards;