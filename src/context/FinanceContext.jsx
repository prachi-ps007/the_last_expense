import { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const FinanceContext = createContext();

// 🌱 DEFAULT DEMO DATA
const defaultTransactions = [
  // 💰 Income
  { id: "1", title: "Salary", amount: 50000, category: "Income", type: "income", date: "2026-03-01" },
  { id: "2", title: "Freelance UI Project", amount: 12000, category: "Freelance", type: "income", date: "2026-03-05" },
  { id: "3", title: "Stock Profit", amount: 6000, category: "Investment", type: "income", date: "2026-03-12" },
  { id: "4", title: "Part-time Teaching", amount: 8000, category: "Income", type: "income", date: "2026-03-18" },

  // 🏠 Rent & Utilities
  { id: "5", title: "Apartment Rent", amount: 15000, category: "Rent", type: "expense", date: "2026-03-01" },
  { id: "6", title: "Electricity Bill", amount: 2200, category: "Utilities", type: "expense", date: "2026-03-03" },
  { id: "7", title: "Water Bill", amount: 800, category: "Utilities", type: "expense", date: "2026-03-04" },
  { id: "8", title: "Internet", amount: 999, category: "Utilities", type: "expense", date: "2026-03-06" },

  // 🍔 Food & Dining
  { id: "9", title: "Swiggy Order", amount: 350, category: "Food", type: "expense", date: "2026-03-02" },
  { id: "10", title: "Zomato Dinner", amount: 780, category: "Food", type: "expense", date: "2026-03-07" },
  { id: "11", title: "Cafe Coffee", amount: 220, category: "Food", type: "expense", date: "2026-03-09" },
  { id: "12", title: "Dining Out", amount: 1200, category: "Food", type: "expense", date: "2026-03-15" },

  // 🚕 Travel
  { id: "13", title: "Uber Ride", amount: 300, category: "Travel", type: "expense", date: "2026-03-05" },
  { id: "14", title: "Metro Card Recharge", amount: 500, category: "Travel", type: "expense", date: "2026-03-08" },
  { id: "15", title: "OLA Ride", amount: 250, category: "Travel", type: "expense", date: "2026-03-11" },

  // 🛍 Shopping
  { id: "16", title: "Amazon Shopping", amount: 2400, category: "Shopping", type: "expense", date: "2026-03-10" },
  { id: "17", title: "Clothing", amount: 3200, category: "Shopping", type: "expense", date: "2026-03-17" },
  { id: "18", title: "Flipkart Gadgets", amount: 5400, category: "Shopping", type: "expense", date: "2026-03-21" },

  // 🎬 Entertainment
  { id: "19", title: "Movie Tickets", amount: 600, category: "Entertainment", type: "expense", date: "2026-03-06" },
  { id: "20", title: "Concert Pass", amount: 2500, category: "Entertainment", type: "expense", date: "2026-03-20" },

  // 💪 Health
  { id: "21", title: "Gym Membership", amount: 1800, category: "Health", type: "expense", date: "2026-03-03" },
  { id: "22", title: "Doctor Visit", amount: 900, category: "Health", type: "expense", date: "2026-03-14" },

  // 📺 Subscriptions
  { id: "23", title: "Netflix", amount: 499, category: "Subscriptions", type: "expense", date: "2026-03-01" },
  { id: "24", title: "Spotify", amount: 199, category: "Subscriptions", type: "expense", date: "2026-03-02" },
  { id: "25", title: "YouTube Premium", amount: 129, category: "Subscriptions", type: "expense", date: "2026-03-05" },

  // 🧾 Misc
  { id: "26", title: "Stationery", amount: 300, category: "Misc", type: "expense", date: "2026-03-08" },
  { id: "27", title: "Gift Purchase", amount: 1500, category: "Misc", type: "expense", date: "2026-03-13" },
  { id: "28", title: "Repair Work", amount: 2000, category: "Misc", type: "expense", date: "2026-03-19" },

  // 💼 More income
  { id: "29", title: "Bonus", amount: 10000, category: "Income", type: "income", date: "2026-03-22" },
  { id: "30", title: "Freelance Backend Work", amount: 18000, category: "Freelance", type: "income", date: "2026-03-23" },
];

export const FinanceProvider = ({ children }) => {
  // 🌟 STATE
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);

  // 📥 LOAD DATA (WITH DEMO SEED)
 useEffect(() => {
  const storedTransactions = localStorage.getItem("transactions");
  const storedBudget = localStorage.getItem("budget");

  if (storedTransactions) {
    const parsed = JSON.parse(storedTransactions);

    // ✅ CHECK IF EMPTY ARRAY
    if (parsed.length > 0) {
      setTransactions(parsed);
    } else {
      setTransactions(defaultTransactions);
    }
  } else {
    setTransactions(defaultTransactions);
  }

  if (storedBudget) {
    setBudget(JSON.parse(storedBudget));
  }
}, []);

  // 💾 SAVE TRANSACTIONS
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // 💾 SAVE BUDGET
  useEffect(() => {
    localStorage.setItem("budget", JSON.stringify(budget));
  }, [budget]);

  // ➕ ADD TRANSACTION
  const addTransaction = (txn) => {
    const newTxn = {
      id: uuidv4(),
      ...txn,
    };

    setTransactions((prev) => [newTxn, ...prev]);
  };

  // ❌ DELETE TRANSACTION
  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // ✏️ UPDATE TRANSACTION
  const updateTransaction = (updatedTxn) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTxn.id ? updatedTxn : t))
    );
  };

  // 📊 CALCULATIONS
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const balance = totalIncome - totalExpense;

  // 🌐 GLOBAL VALUE
  const value = {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    budget,
    setBudget,
    totalIncome,
    totalExpense,
    balance,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};