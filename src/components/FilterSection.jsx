import React from "react";
import { Search } from "lucide-react";

function FilterSection({
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
  ];

  const timeFilters = [
    { label: "All", value: "all" },
    { label: "Last 30 Days", value: "30days" },
    { label: "This Month", value: "month" },
  ];

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  return (
    <div className="mb-8 space-y-6">

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transactions..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-slate-100 outline-none"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center py-4 gap-4 overflow-x-auto">

        {/* Time */}
        <div className="flex gap-2">
          {timeFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setDateFilter(f.value)}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                dateFilter === f.value
                  ? "bg-sky-600 text-white"
                  : "bg-sky-100/50 text-slate-600 hover:bg-sky-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-slate-200"></div>

        {/* Categories */}
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                selectedCategories.includes(cat)
                  ? "bg-sky-600 text-white"
                  : "bg-sky-100/50 text-slate-600 hover:bg-sky-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterSection;