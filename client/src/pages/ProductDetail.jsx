import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { add } = useCart();
  const [p, setP] = useState(null);
  const [img, setImg] = useState(0);
  const [color, setColor] = useState(null);
  const [storage, setStorage] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    api(`/products/${id}`).then((d) => {
      setP(d);
      setColor(d.colors?.[0]?.name);
      setStorage(d.storageOptions?.[0]?.size);
    });
  }, [id]);

  if (!p) return <div className="p-20 text-center">Loading…</div>;

  const price =
    p.storageOptions.find((s) => s.size === storage)?.price ?? p.price;
  const gallery = p.colors.find((c) => c.name === color)?.images?.length
    ? p.colors.find((c) => c.name === color).images
    : p.images;

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-2">
      {/* Gallery */}
      <div>
        <div className="aspect-square rounded-2xl bg-slate-50 p-6">
          <img
            src={gallery[img]}
            alt={p.name}
            className="h-full w-full object-contain"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://placehold.co/600x600/f1f5f9/94a3b8?text=${encodeURIComponent(p.name)}`; }}
          />
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto">
          {gallery.map((src, i) => (
            <button
              key={i}
              onClick={() => setImg(i)}
              className={`h-20 w-20 shrink-0 rounded-xl bg-slate-50 p-2 transition ${i === img ? "ring-2 ring-violet-500" : "border border-slate-100"}`}
            >
              <img src={src} alt="" className="h-full w-full object-contain"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/80x80/f1f5f9/94a3b8?text=img"; }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div>
        <p className="text-sm uppercase tracking-wide text-neutral-500">
          {p.brand}
        </p>
        <h1 className="mt-1 text-3xl font-bold">{p.name}</h1>
        <p className="mt-4 text-3xl font-semibold">${price.toLocaleString()}</p>
        <p className="mt-4 text-neutral-600">{p.description}</p>

        {p.colors.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">
              Color: <span className="text-neutral-500">{color}</span>
            </p>
            <div className="flex gap-3">
              {p.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    setColor(c.name);
                    setImg(0);
                  }}
                  aria-label={c.name}
                  style={{ background: c.hex }}
                  className={`h-9 w-9 rounded-full border-2 transition ${color === c.name ? "ring-2 ring-violet-500 ring-offset-2" : ""}`}
                />
              ))}
            </div>
          </div>
        )}

        {p.storageOptions.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">Storage</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {p.storageOptions.map((s) => (
                <button
                  key={s.size}
                  onClick={() => setStorage(s.size)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${storage === s.size ? "border-violet-600 bg-gradient-to-r from-violet-600 to-indigo-600 text-white" : "border-slate-200 hover:border-violet-400"}`}
                >
                  {s.size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center gap-4">
          <div className="flex items-center rounded-full border">
            <button
              className="h-11 w-11 text-lg"
              onClick={() => setQty(Math.max(1, qty - 1))}
            >
              −
            </button>
            <span className="w-8 text-center">{qty}</span>
            <button
              className="h-11 w-11 text-lg"
              onClick={() => setQty(qty + 1)}
            >
              +
            </button>
          </div>
          <button
            disabled={p.countInStock < 1}
            onClick={() =>
              add({
                product: p._id,
                name: p.name,
                image: p.images[0],
                price,
                qty,
                color,
                storage,
              })
            }
            className="flex-1 rounded-full bg-black py-3 font-medium text-white transition hover:bg-neutral-800 disabled:bg-neutral-300"
          >
            {p.countInStock < 1 ? "Out of stock" : "Add to Cart"}
          </button>
        </div>

        {p.specs && (
          <dl className="mt-10 divide-y rounded-xl border text-sm">
            {Object.entries(p.specs).map(([k, v]) => (
              <div key={k} className="flex justify-between px-4 py-3">
                <dt className="text-neutral-500">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}
