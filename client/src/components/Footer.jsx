import { Link } from "react-router-dom";

const currentYear = new Date().getFullYear();

const shopLinks = [
  ["Smartphones", "/shop?category=smartphones"],
  ["Consoles", "/shop?category=consoles"],
  ["Accessories", "/shop?category=accessories"],
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div>
          <Link to="/" className="text-xl font-semibold tracking-tight">
            Cyber<span className="text-neutral-400">Store</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-neutral-400">
            Technology and everyday essentials, selected for you.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Shop</h2>
          <ul className="mt-4 space-y-3 text-sm text-neutral-400">
            {shopLinks.map(([label, to]) => (
              <li key={label}>
                <Link to={to} className="transition hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Explore</h2>
          <ul className="mt-4 space-y-3 text-sm text-neutral-400">
            <li>
              <Link to="/" className="transition hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="transition hover:text-white">
                All products
              </Link>
            </li>
            <li>
              <Link to="/cart" className="transition hover:text-white">
                Your cart
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Contact us</h2>
          <ul className="mt-4 space-y-4">
            <li className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-base">
                ✉
              </span>
              <div>
                <p className="text-sm font-medium">Email support</p>
                <a
                  href="mailto:danieldeslew23@gamil.com"
                  className="text-xs text-neutral-400 transition hover:text-white"
                >
                  danieldeslew23@gamil.com
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-base">
                ☎
              </span>
              <div>
                <p className="text-sm font-medium">Phone</p>
                <a
                  href="tel:0954207319"
                  className="text-xs text-neutral-400 transition hover:text-white"
                >
                  0954207319
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-5 text-xs text-neutral-500 sm:px-8">
          © {currentYear} CyberStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
