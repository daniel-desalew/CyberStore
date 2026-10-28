import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  PackageCheck,
  ShieldCheck,
  Smartphone,
  Truck,
} from "lucide-react";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";

const categories = [
  { name: "Laptops & PC", slug: "laptops", img: "/products/macbook-air-m3.jpg" },
  { name: "Watches", slug: "watches", img: "/products/apple-watch-s10.svg" },
  { name: "Smartphones", slug: "smartphones", img: "/products/iphone-15-pro-max.jpg" },
  { name: "Audio & accessories", slug: "accessories", img: "/products/airpods-pro-2.svg" },
  { name: "Games & consoles", slug: "consoles", img: "/products/ps5-slim.svg" },
];

const benefits = [
  { title: "Free Shipping", caption: "On orders over $100", icon: Truck },
  { title: "14 Day Returns", caption: "Easy hassle-free returns", icon: PackageCheck },
  { title: "Secure Payments", caption: "Protected checkout", icon: ShieldCheck },
  { title: "Quality Guaranteed", caption: "Products you can trust", icon: BadgeCheck },
];

const FALLBACK_ARRIVALS = [
  { name: "Apple iPhone 15 Pro Max", image: "/products/iphone-15-pro-max.jpg", price: 1199 },
  { name: "Google Pixel 8 Pro", image: "/products/pixel-8-pro.jpg", price: 999 },
  { name: "OnePlus 12", image: "/products/oneplus-12.jpg", price: 799 },
  { name: "Sony Xperia 1 VI", image: "/products/xperia-1-vi.jpg", price: 1299 },
  { name: "Xiaomi 14 Ultra", image: "/products/xiaomi-14-ultra.jpg", price: 1099 },
  { name: "Apple iPhone 15", image: "/products/iphone-15.jpg", price: 799 },
  { name: "Samsung Galaxy A55", image: "/products/galaxy-a55.jpg", price: 449 },
  { name: "Nothing Phone 2a", image: "/products/nothing-phone-2a.jpg", price: 349 },
];

export default function Home() {
  const [data, setData] = useState({ featured: [], trending: [] });
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    api("/products/featured").then(setData).catch(console.error);
    api("/products?limit=8&sort=newest")
      .then((r) => setLatest(r.products || []))
      .catch(console.error);
  }, []);

  const products = data.trending.length
    ? data.trending
    : data.featured.length
      ? data.featured
      : latest;
  const hasCatalogProducts = products.length > 0;

  return (
    <div className="bg-[#f8f7ff]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <section className="grid gap-4 py-5 lg:grid-cols-[2fr_1fr]">
          <div className="relative flex min-h-[300px] items-center overflow-hidden rounded-xl bg-gradient-to-br from-[#211b1a] via-[#34251f] to-[#76533e] px-6 py-8 text-white sm:min-h-[350px] sm:px-10 lg:px-12">
            <div className="relative z-10 max-w-[55%] sm:max-w-[48%]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-200 sm:text-xs">
                Limited edition
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                iPhone 17 <span className="text-amber-200">Pro</span>
              </h1>
              <p className="mt-3 max-w-xs text-xs leading-5 text-white/75 sm:text-sm">
                Pro performance, advanced cameras, and a brilliant display.
              </p>
              <Link
                to="/shop?category=smartphones"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:opacity-90 sm:text-sm"
              >
                Shop now <ArrowRight size={15} />
              </Link>
            </div>
            <img
              src="/iphone-17-pro.svg"
              alt="iPhone 17 Pro"
              className="absolute -right-2 bottom-0 h-[94%] w-[58%] object-contain object-bottom sm:right-4 sm:h-full sm:w-[55%]"
            />
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              <span className="h-1.5 w-5 rounded-full bg-white" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            <Link
              to="/shop?category=accessories"
              className="group relative flex min-h-36 items-center overflow-hidden rounded-xl bg-indigo-50 p-4 transition hover:bg-indigo-100 sm:min-h-40 sm:p-5 lg:min-h-0"
            >
              <div className="relative z-10 max-w-[65%]">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                  Smart home
                </p>
                <h2 className="mt-1 text-sm font-bold leading-snug text-neutral-900 sm:text-base">
                  Make life a little smarter
                </h2>
                <span className="mt-2 inline-block text-[10px] font-semibold text-violet-700 sm:text-xs">
                  Shop accessories →
                </span>
              </div>
              <div className="absolute -right-2 bottom-1 text-indigo-200 transition group-hover:scale-110">
                <Camera size={88} strokeWidth={1.2} />
              </div>
            </Link>

            <Link
              to="/shop?category=smartphones"
              className="group relative flex min-h-36 items-center overflow-hidden rounded-xl bg-stone-100 p-4 transition hover:bg-stone-200 sm:min-h-40 sm:p-5 lg:min-h-0"
            >
              <div className="relative z-10 max-w-[65%]">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                  New arrivals
                </p>
                <h2 className="mt-1 text-sm font-bold leading-snug text-neutral-900 sm:text-base">
                  Discover your next phone
                </h2>
                <span className="mt-2 inline-block text-[10px] font-semibold text-violet-700 sm:text-xs">
                  Shop phones →
                </span>
              </div>
              <div className="absolute -right-2 bottom-1 text-stone-300 transition group-hover:scale-110">
                <Smartphone size={90} strokeWidth={1.2} />
              </div>
            </Link>
          </div>
        </section>

        <section
          aria-label="Shopping benefits"
          className="grid grid-cols-2 gap-4 border-b border-neutral-100 py-5 sm:grid-cols-4 sm:gap-3"
        >
          {benefits.map(({ title, caption, icon: Icon }) => (
            <div key={title} className="flex items-center gap-2.5 sm:justify-center">
              <Icon size={20} strokeWidth={1.6} className="shrink-0 text-neutral-500" />
              <div>
                <h2 className="text-[11px] font-semibold text-neutral-800 sm:text-xs">
                  {title}
                </h2>
                <p className="mt-0.5 text-[10px] text-neutral-500">{caption}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="py-7 sm:py-9">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900 sm:text-xl">
              Browse by category
            </h2>
            <Link
              to="/shop"
              className="text-xs font-medium text-slate-400 hover:text-violet-600"
            >
              View all <ArrowRight size={14} className="ml-1 inline" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-5">
            {categories.map(({ name, slug, img }) => (
              <Link
                key={slug}
                to={`/shop?category=${slug}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-white px-2 py-4 text-center transition hover:border-violet-300 hover:bg-violet-50 sm:gap-3 sm:py-5"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-sm transition group-hover:scale-110 sm:h-14 sm:w-14">
                  <img src={img} alt={name} className="h-8 w-8 object-contain sm:h-9 sm:w-9" />
                </span>
                <span className="text-[10px] font-medium text-neutral-700 sm:text-xs">
                  {name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="pb-10 sm:pb-14">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-600">
                {hasCatalogProducts ? "Just arrived" : "Catalog highlights"}
              </p>
              <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                {hasCatalogProducts ? "New Arrivals" : "Featured products"}
              </h2>
            </div>
            <Link
              to={hasCatalogProducts ? "/shop?sort=newest" : "/shop"}
              className="text-xs font-medium text-slate-400 hover:text-violet-600"
            >
              View all <ArrowRight size={14} className="ml-1 inline" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {hasCatalogProducts ? products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} p={product} />
            )) : FALLBACK_ARRIVALS.map((product) => (
              <Link
                key={product.name}
                to={`/shop?search=${encodeURIComponent(product.name)}`}
                className="group block rounded-2xl border border-slate-100 bg-white p-3 transition hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100 sm:p-4"
              >
                <div className="aspect-square overflow-hidden rounded-xl bg-slate-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105 sm:p-4"
                  />
                </div>
                <h3 className="mt-3 line-clamp-1 text-sm font-medium text-slate-800">{product.name}</h3>
                <p className="mt-2 text-lg font-bold text-slate-900">${product.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
