import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, Search, UserRound, LogOut, Mail, Phone, MessageCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const links = [
  ["Popular", "/shop?sort=rating"],
  ["Shop", "/shop"],
  ["Smartphones", "/shop?category=smartphones"],
  ["Consoles", "/shop?category=consoles"],
  ["Accessories", "/shop?category=accessories"],
];

function ContactPopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Contact support"
        className={`text-slate-500 hover:text-violet-600 transition ${open ? "text-violet-600" : ""}`}
      >
        <Mail size={20} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 w-64 rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl shadow-violet-100">
          <p className="mb-3 text-sm font-semibold text-slate-800">Contact us</p>
          <ul className="space-y-3">
            <li>
              <a
                href="mailto:danieldeslew23@gamil.com"
                className="flex items-center gap-3 rounded-xl p-2.5 text-sm text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-violet-100 text-violet-700">
                  <Mail size={15} />
                </span>
                <div>
                  <p className="font-medium">Email support</p>
                  <p className="text-xs text-slate-400">danieldeslew23@gamil.com</p>
                </div>
              </a>
            </li>
            <li>
              <a
                href="tel:0954207319"
                className="flex items-center gap-3 rounded-xl p-2.5 text-sm text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                  <Phone size={15} />
                </span>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-xs text-slate-400">0954207319</p>
                </div>
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("open-live-chat"))}
                className="flex w-full items-center gap-3 rounded-xl p-2.5 text-sm text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-100 text-indigo-700">
                  <MessageCircle size={15} />
                </span>
                <div className="text-left">
                  <p className="font-medium">Live chat</p>
                  <p className="text-xs text-slate-400">Mon–Fri, 9am–6pm</p>
                </div>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState("");
  const { count, setOpen } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLinkActive = (to) => {
    const [path, query = ""] = to.split("?");
    if (location.pathname !== path) return false;
    const requiredParams = new URLSearchParams(query);
    const currentParams = new URLSearchParams(location.search);
    return [...requiredParams].every(([key, value]) => currentParams.get(key) === value);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
    setSearch("");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur text-slate-900 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:gap-8">
        <Link to="/" className="shrink-0 text-xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Cyber</span>Store
        </Link>

        <form
          onSubmit={submitSearch}
          className="hidden min-w-0 flex-1 items-center rounded-xl bg-slate-100 px-3 sm:flex lg:max-w-xl border border-transparent focus-within:border-violet-300 focus-within:bg-white transition"
        >
          <Search size={18} className="shrink-0 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            type="search"
            placeholder="I am shopping for..."
            aria-label="Search products"
            className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-slate-400"
          />
          <button type="submit" className="sr-only">Search products</button>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-4">
          <Link to="/shop" aria-label="Browse products" className="text-slate-500 hover:text-violet-600 sm:hidden">
            <Search size={20} />
          </Link>
          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm font-medium text-slate-700">{user.name}</span>
              <button
                onClick={() => { logout(); navigate("/"); }}
                aria-label="Sign out"
                className="text-slate-400 hover:text-red-500"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" aria-label="Sign in" className="hidden text-slate-500 hover:text-violet-600 sm:block">
              <UserRound size={20} />
            </Link>
          )}
          <ContactPopover />
          <button
            onClick={() => setOpen(true)}
            className="relative text-slate-500 hover:text-violet-600"
            aria-label={`Cart${count > 0 ? `, ${count} items` : ""}`}
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </button>
          <button
            className="text-slate-500 md:hidden"
            onClick={() => setMenu(!menu)}
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
          >
            {menu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <nav className="hidden border-t border-slate-100 md:block">
        <ul className="mx-auto flex max-w-7xl items-center gap-7 px-4 py-2.5 text-xs font-medium text-slate-500 sm:px-6">
          {links.map(([label, to]) => (
            <li key={label}>
              <Link
                to={to}
                aria-current={isLinkActive(to) ? "page" : undefined}
                className={`transition hover:text-violet-600 ${isLinkActive(to) ? "text-violet-600" : ""}`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li className="ml-auto">
            <Link
              to="/shop?sort=deals"
              aria-current={isLinkActive("/shop?sort=deals") ? "page" : undefined}
              className={`flex items-center gap-1.5 transition hover:text-violet-600 ${isLinkActive("/shop?sort=deals") ? "text-violet-600" : "text-slate-400"}`}
            >
              Best deals
              <span className="rounded bg-gradient-to-r from-rose-500 to-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">HOT</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className={`overflow-hidden border-t border-slate-100 transition-all duration-300 md:hidden ${menu ? "max-h-80" : "max-h-0 border-t-0"}`}>
        <ul className="space-y-1 px-4 py-3">
          {links.map(([label, to]) => (
            <li key={label}>
              <Link
                to={to}
                onClick={() => setMenu(false)}
                className="block rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700"
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/shop?sort=deals"
              onClick={() => setMenu(false)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition hover:bg-violet-50 hover:text-violet-700 ${isLinkActive("/shop?sort=deals") ? "bg-violet-50 text-violet-700" : "text-slate-700"}`}
            >
              Best deals
              <span className="rounded bg-gradient-to-r from-rose-500 to-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">HOT</span>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
