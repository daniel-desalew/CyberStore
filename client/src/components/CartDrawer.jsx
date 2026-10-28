import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useCart } from "../context/CartContext";

export function CartLines() {
  const { items, setQty, remove, key } = useCart();
  if (!items.length)
    return (
      <p className="py-16 text-center text-neutral-500">Your cart is empty.</p>
    );
  return (
    <ul className="divide-y">
      {items.map((i) => (
        <li key={key(i)} className="flex gap-4 py-4">
          <img
            src={i.image}
            alt=""
            className="h-20 w-20 rounded-xl bg-neutral-100 object-contain p-2"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/80x80/f1f5f9/94a3b8?text=img"; }}
          />
          <div className="flex-1">
            <p className="font-medium">{i.name}</p>
            <p className="text-sm text-neutral-500">
              {[i.color, i.storage].filter(Boolean).join(" · ")}
            </p>
            <div className="mt-2 flex items-center gap-3 text-sm">
              <button
                onClick={() => setQty(key(i), i.qty - 1)}
                className="h-7 w-7 rounded-full border"
              >
                −
              </button>
              {i.qty}
              <button
                onClick={() => setQty(key(i), i.qty + 1)}
                className="h-7 w-7 rounded-full border"
              >
                +
              </button>
              <button
                onClick={() => remove(key(i))}
                className="ml-auto text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
          <p className="font-semibold">${(i.price * i.qty).toLocaleString()}</p>
        </li>
      ))}
    </ul>
  );
}

export default function CartDrawer() {
  const { open, setOpen, subtotal, items } = useCart();
  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Your cart</h2>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4">
          <CartLines />
        </div>
        {items.length > 0 && (
          <div className="space-y-3 border-t p-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-black py-3 text-center font-medium text-white"
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
