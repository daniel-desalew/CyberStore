import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const populated = (userId) =>
  Cart.findOne({ user: userId }).populate(
    "items.product",
    "name images countInStock",
  );

export const getCart = async (req, res) => {
  const cart = (await populated(req.user._id)) || { items: [] };
  res.json(cart);
};

// POST /api/cart  { productId, qty, color, storage }
export const addToCart = async (req, res) => {
  const { productId, qty = 1, color, storage } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const unitPrice =
    product.storageOptions.find((s) => s.size === storage)?.price ??
    product.price;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const existing = cart.items.find(
    (i) =>
      i.product.equals(productId) && i.color === color && i.storage === storage,
  );
  if (existing) existing.qty += qty;
  else
    cart.items.push({
      product: productId,
      qty,
      color,
      storage,
      price: unitPrice,
    });

  await cart.save();
  res.status(201).json(await populated(req.user._id));
};

// PUT /api/cart/:itemId  { qty }
export const updateCartItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  const item = cart?.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: "Item not found" });
  item.qty = Math.max(1, Number(req.body.qty));
  await cart.save();
  res.json(await populated(req.user._id));
};

// DELETE /api/cart/:itemId
export const removeCartItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.json({ items: [] });
  cart.items.pull(req.params.itemId);
  await cart.save();
  res.json(await populated(req.user._id));
};
