import React from "react";

function SearchAndFilters({
  search,
  setSearch,
  selectedCategories,
  setSelectedCategories,
  dateFilter,
  setDateFilter,
}) {
  const categories = [
    "Food",
    "Travel",
    "Rent",
    "Shopping",
    "Entertainment",
    "Health",
    "Utilities",
    "Subscriptions",
    "Income",
  ];

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 mb-8">
      
      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search transactions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded-xl bg-slate-800 text-white outline-none"
      />

      {/* 📅 Date Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "30days", "month"].map((type) => (
          <button
            key={type}
            onClick={() => setDateFilter(type)}
            className={`px-3 py-1 text-xs rounded-full ${
              dateFilter === type
                ? "bg-indigo-500 text-white"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            {type === "all"
              ? "All"
              : type === "30days"
              ? "Last 30 Days"
              : "This Month"}
          </button>
        ))}
      </div>

      {/* 🎯 Categories */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={`px-3 py-1 text-xs rounded-full ${
              selectedCategories.includes(cat)
                ? "bg-indigo-500 text-white"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchAndFilters;