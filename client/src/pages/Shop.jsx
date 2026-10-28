import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [opts, setOpts] = useState({ brands: [], categories: [], price: { min: 0, max: 5000 } });
  const [res, setRes]   = useState({ products: [], total: 0 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { api("/products/filters").then(setOpts); }, []);
  useEffect(() => { api(`/products?${params}`).then(setRes); }, [params]);

  const toggle = (key, value) => {
    const cur  = params.get(key)?.split(",").filter(Boolean) || [];
    const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
    const p = new URLSearchParams(params);
    next.length ? p.set(key, next.join(",")) : p.delete(key);
    setParams(p);
  };
  const isOn = (key, v) => params.get(key)?.split(",").includes(v);

  const activeCount = [
    ...(params.get("category")?.split(",").filter(Boolean) || []),
    ...(params.get("brand")?.split(",").filter(Boolean) || []),
    ...(params.get("maxPrice") ? ["price"] : []),
  ].length;

  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* Top bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-800">
            {params.get("sort") === "deals" ? "Best deals" : "Shop"} <span className="text-base font-normal text-slate-400">({res.total} products)</span>
          </h1>
          <div className="flex items-center gap-2">
            <select
              value={params.get("sort") || ""}
              onChange={(e) => { const p = new URLSearchParams(params); p.set("sort", e.target.value); setParams(p); }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
            >
              <option value="">Newest</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
              <option value="deals">Best deals</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="relative flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm lg:hidden hover:border-violet-400"
            >
              <SlidersHorizontal size={15} /> Filters
              {activeCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                  {activeCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active chips */}
        {activeCount > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {(params.get("category")?.split(",").filter(Boolean) || []).map((c) => (
              <button key={c} onClick={() => toggle("category", c)}
                className="flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 hover:bg-violet-200 transition capitalize">
                {c} <X size={12} />
              </button>
            ))}
            {(params.get("brand")?.split(",").filter(Boolean) || []).map((b) => (
              <button key={b} onClick={() => toggle("brand", b)}
                className="flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-200 transition">
                {b} <X size={12} />
              </button>
            ))}
            {params.get("maxPrice") && (
              <button onClick={() => { const p = new URLSearchParams(params); p.delete("maxPrice"); setParams(p); }}
                className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-200 transition">
                Max ${params.get("maxPrice")} <X size={12} />
              </button>
            )}
            <button onClick={() => setParams({})}
              className="rounded-full px-3 py-1 text-xs text-slate-500 underline underline-offset-2 hover:text-slate-800 transition">
              Clear all
            </button>
          </div>
        )}

        <div className="grid min-w-0 gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">

          {/* ── SIDEBAR ── */}
          <aside className={`${showFilters ? "block" : "hidden"} min-w-0 space-y-6 lg:block`}>

            {/* CATEGORY cards */}
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Categories</h3>
              <div className="grid w-full grid-cols-2 gap-2.5">
                {opts.categories.map((c) => {
                  const active = isOn("category", c);
                  return (
                    <button key={c} onClick={() => toggle("category", c)}
                      className={[
                        "relative flex min-h-12 items-center justify-center rounded-xl border px-3 py-2.5 text-center text-sm font-medium capitalize transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
                        active
                          ? "border-violet-600 bg-violet-50 text-violet-800 shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50/60 hover:text-violet-700",
                      ].join(" ")}>
                      <span className="leading-tight">{c}</span>
                      {active && (
                        <span aria-hidden="true" className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* BRAND list */}
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Brands</h3>
              <div className="flex flex-col gap-1">
                {opts.brands.map((b) => {
                  const active = isOn("brand", b);
                  return (
                    <button key={b} onClick={() => toggle("brand", b)}
                      className={[
                        "flex items-center rounded-xl border-2 px-3 py-2 transition-all duration-200 text-left",
                        active
                          ? "border-violet-500 bg-violet-50 shadow-sm"
                          : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50",
                      ].join(" ")}>
                      <span className={`flex-1 text-sm font-medium ${active ? "text-violet-700" : "text-slate-700"}`}>{b}</span>
                      {active && (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white text-[9px]">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-slate-200" />
            {/* Price range */}
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Max Price</h3>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">${opts.price.min}</span>
                <span className="text-sm font-bold text-violet-700">${params.get("maxPrice") ?? opts.price.max}</span>
              </div>
              <input type="range"
                min={opts.price.min} max={opts.price.max}
                value={params.get("maxPrice") ?? opts.price.max}
                onChange={(e) => { const p = new URLSearchParams(params); p.set("maxPrice", e.target.value); setParams(p); }}
                className="w-full accent-violet-600" />
            </div>

          </aside>

          {/* ── PRODUCT GRID ── */}
          <section className="min-w-0">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {res.products.map((p) => (
                <ProductCard key={p._id} p={p} />
              ))}
              {!res.products.length && (
                <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
                  <span className="text-5xl mb-4">🔍</span>
                  <p className="text-lg font-semibold text-slate-600">No products found</p>
                  <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
                  <button onClick={() => setParams({})}
                    className="mt-4 rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition">
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
