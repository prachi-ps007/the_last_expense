import { useState, useEffect } from "react";

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "JPY"];

export default function useCurrency(base = "INR") {
  const [rates, setRates] = useState({});
  const [currency, setCurrency] = useState(base);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRates() {
      try {
        setLoading(true);

        const res = await fetch(
          `https://api.exchangerate.host/latest?base=${base}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch rates");
        }

        const data = await res.json();

        if (data?.rates) {
          setRates(data.rates);
        } else {
          setRates({});
        }
      } catch (err) {
        console.error("Currency fetch error:", err);
        setRates({});
      } finally {
        setLoading(false);
      }
    }

    fetchRates();
  }, [base]);

  const convert = (amount) => {
    if (!rates || !rates[currency]) return amount;
    return (amount * rates[currency]).toFixed(2);
  };

  return { currency, setCurrency, convert, rates, loading };
}