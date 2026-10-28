import { createContext, useContext, useEffect, useState } from "react";

const defaultContext = {
  items: [],
  add: () => {},
  setQty: () => {},
  remove: () => {},
  key: () => "",
  count: 0,
  subtotal: 0,
  open: false,
  setOpen: () => {},
};

const CartContext = createContext(defaultContext);
export const useCart = () => useContext(CartContext) ?? defaultContext;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() =>
    JSON.parse(localStorage.getItem("cart") || "[]"),
  );
  const [open, setOpen] = useState(false);

  useEffect(() => localStorage.setItem("cart", JSON.stringify(items)), [items]);

  const key = (i) => `${i.product}-${i.color}-${i.storage}`;

  const add = (item) => {
    setItems((prev) => {
      const found = prev.find((p) => key(p) === key(item));
      return found
        ? prev.map((p) =>
            key(p) === key(item) ? { ...p, qty: p.qty + item.qty } : p,
          )
        : [...prev, item];
    });
    setOpen(true);
  };
  const setQty = (k, qty) =>
    setItems((p) =>
      p.map((i) => (key(i) === k ? { ...i, qty: Math.max(1, qty) } : i)),
    );
  const remove = (k) => setItems((p) => p.filter((i) => key(i) !== k));

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        add,
        setQty,
        remove,
        key,
        count,
        subtotal,
        open,
        setOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
