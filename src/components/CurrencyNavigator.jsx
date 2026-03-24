import { motion } from "framer-motion";

const currencies = ["INR", "USD", "EUR", "GBP", "JPY"];

export default function CurrencyNavigator({ currency, setCurrency }) {
  return (
    <div className="flex justify-center mt-6">
      <div className="flex gap-3 px-4 py-2 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg">

        {currencies.map((cur) => (
          <motion.button
            key={cur}
            onClick={() => setCurrency(cur)}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            className={`px-4 py-1 rounded-xl text-sm tracking-wider transition-all duration-500
              ${
                currency === cur
                  ? "bg-gradient-to-r from-[#D4AF37] to-[#F9E27E] text-black shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                  : "text-white/60 hover:text-white"
              }`}
          >
            {cur}
          </motion.button>
        ))}
      </div>
    </div>
  );
}