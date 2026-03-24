import React, { useContext, useState } from "react";
import { FinanceContext } from "../context/FinanceContext";
import SummaryCards from "../components/SummaryCards";
import FilterSection from "../components/FilterSection";
import useDebounce from "../hooks/useDebounce";
import { X } from "lucide-react";

function Transactions() {
  const {
    transactions,
    deleteTransaction,
    totalIncome,
    totalExpense,
    balance,
  } = useContext(FinanceContext);

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dateFilter, setDateFilter] = useState("all");

  const debouncedSearch = useDebounce(search);

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (txn.notes || "")
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(txn.category);

    const txnDate = new Date(txn.date);
    const now = new Date();

    let matchesDate = true;

    if (dateFilter === "30days") {
      const last30 = new Date();
      last30.setDate(now.getDate() - 30);
      matchesDate = txnDate >= last30;
    }

    if (dateFilter === "month") {
      matchesDate =
        txnDate.getMonth() === now.getMonth() &&
        txnDate.getFullYear() === now.getFullYear();
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  return (
    <div className="min-h-screen pt-24 px-6 bg-gradient-to-b from-[#0ea5e9] via-[#38bdf8] to-[#7dd3fc] text-slate-800">

      

      {/* Summary */}
      <SummaryCards
        balance={balance}
        income={totalIncome}
        expense={totalExpense}
      />
      <br></br>

      {/* Filters */}
      <FilterSection
        search={search}
        setSearch={setSearch}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl overflow-hidden">

        {/* Header */}
        <div className="grid grid-cols-4 px-6 py-3 text-xs font-bold tracking-wider text-slate-500 uppercase border-b border-slate-100">
          <span>Merchant</span>
          <span>Category</span>
          <span>Date</span>
          <span className="text-right">Amount</span>
        </div>

        {/* Data */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center text-slate-400 py-10">
            No transactions found
          </div>
        ) : (
          filteredTransactions.map((txn) => (
            <div
              key={txn.id}
              className="grid grid-cols-4 px-6 py-4 items-center border-b border-slate-100 hover:bg-sky-50 transition"
            >
              <span className="font-medium">{txn.title}</span>

              <span className="text-slate-500">{txn.category}</span>

              <span className="text-slate-500">
                {new Date(txn.date).toLocaleDateString()}
              </span>

              <div className="flex justify-end items-center gap-3">
                <span
                  className={`font-mono tabular-nums ${
                    txn.type === "income"
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}
                >
                  {txn.type === "income" ? "+" : "-"} ₹{txn.amount}
                </span>

                <button
                  onClick={() => deleteTransaction(txn.id)}
                  className="p-1 rounded-md hover:bg-red-100 transition"
                >
                  <X size={16} className="text-slate-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Transactions;