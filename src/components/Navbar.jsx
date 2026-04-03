import { NavLink } from "react-router-dom";

const navItems = [
  { name: "HOME", path: "/" },
  { name: "TRANSACTIONS", path: "/transactions" },
  { name: "ADD TRANSACTION", path: "/transactions/new" },
  { name: "BUDGET", path: "/budget" },
  { name: "INSIGHTS", path: "/insights" },
];

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/5 border-b border-white/10">
      <div className="w-full px-6 py-4 flex justify-end gap-16">

        {navItems.map((item) => (
               <NavLink
  key={item.name}
  to={item.path}
 className={({ isActive }) =>
  `font-[Amatic_SC] text-2xl group tracking-widest font-extrabold px-2 py-1 transition-all duration-300 
  ${isActive 
    ? "text-indigo-300 border-b-2 border-indigo-400" 
    : "text-white hover:text-white hover:border-b-2 hover:border-indigo-400"}`
}
>
  {item.name}

  <span
    className={`absolute left-0 -bottom-1 h-[2px] bg-indigo-400 transition-all duration-300 
    ${"w-0 group-hover:w-full"}`}
  ></span>
</NavLink>
        ))}

      </div>
    </nav>
  );
}

export default Navbar;