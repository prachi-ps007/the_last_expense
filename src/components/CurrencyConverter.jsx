import { useState, useEffect } from "react";

const currencies = ["INR", "USD", "EUR", "GBP", "JPY"];

export default function CurrencyConverter({ rates }) {
  const [amount, setAmount] = useState(1000);
  const [from, setFrom] = useState("INR");
  const [to, setTo] = useState("USD");
  const [result, setResult] = useState("Loading...");

  useEffect(() => {
    if (!rates || Object.keys(rates).length === 0) {
      setResult("Loading...");
      return;
    }
    let inINR = from === "INR" ? amount : amount / rates[from];
    const converted = inINR * rates[to];
    setResult(converted.toFixed(2));
  }, [amount, from, to, rates]);

  return (
    <div className="max-w-md w-full mx-auto mt-6 p-6 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
      <h2 className="text-center text-[#D4AF37] tracking-widest mb-6">
        Currency Portal
      </h2>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full mb-4 p-3 rounded-xl bg-black/40 text-white border border-white/10"
      />

      <div className="flex gap-4 mb-4">
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="flex-1 p-2 bg-black/40 text-white rounded-lg"
        >
          {currencies.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="flex-1 p-2 bg-black/40 text-white rounded-lg"
        >
          {currencies.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="text-center text-xl text-white mt-4">
        {amount} {from} → <span className="text-[#F9E27E]">{result} {to}</span>
      </div>
    </div>
  );
}