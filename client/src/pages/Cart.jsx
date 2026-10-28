// src/pages/Cart.jsx
import { CartLines } from "../components/CartDrawer";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { subtotal, items } = useCart();
  const shipping = subtotal > 500 || !items.length ? 0 : 15;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = subtotal + shipping + tax;

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="mb-4 text-2xl font-semibold">Shopping cart</h1>
        <CartLines />
      </div>
      <aside className="h-fit rounded-2xl bg-neutral-100 p-6">
        <h2 className="mb-4 text-lg font-semibold">Order summary</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>${subtotal.toLocaleString()}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{shipping ? `$${shipping}` : "Free"}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Tax (8%)</dt>
            <dd>${tax}</dd>
          </div>
          <div className="flex justify-between border-t pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd>${total.toLocaleString()}</dd>
          </div>
        </dl>
        <button
          disabled={!items.length}
          className="mt-6 w-full rounded-full bg-black py-3 font-medium text-white disabled:bg-neutral-300"
        >
          Proceed to checkout
        </button>
      </aside>
    </div>
  );
}
