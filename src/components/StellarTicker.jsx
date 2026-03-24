export default function StellarTicker({ rates }) {
  if (!rates || Object.keys(rates).length === 0) return null;

  const items = ["USD", "EUR", "GBP", "JPY"];

  return (
    <div className="absolute bottom-0 w-full overflow-hidden border-t border-white/10 backdrop-blur-md bg-black/40 py-2">
      <div className="animate-marquee whitespace-nowrap text-yellow-300 text-sm">
        {items.map((cur, i) => (
          <span key={i} className="mx-8">
            INR → {cur}: {rates[cur]?.toFixed(2) || "N/A"}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%) }
          100% { transform: translateX(-100%) }
        }
        .animate-marquee {
          animation: marquee 18s linear infinite;
        }
      `}</style>
    </div>
  );
}