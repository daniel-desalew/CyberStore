import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

// POST /api/orders  { shippingAddress }
export const createOrder = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
  );
  if (!cart?.items.length)
    return res.status(400).json({ message: "Cart is empty" });

  const items = cart.items.map((i) => ({
    product: i.product._id,
    name: i.product.name,
    image: i.product.images[0],
    qty: i.qty,
    color: i.color,
    storage: i.storage,
    price: i.price,
  }));

  const itemsPrice = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingPrice = itemsPrice > 500 ? 0 : 15;
  const taxPrice = +(itemsPrice * 0.08).toFixed(2);

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress: req.body.shippingAddress,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice: itemsPrice + shippingPrice + taxPrice,
  });

  cart.items = [];
  await cart.save();
  res.status(201).json(order);
};

export const getMyOrders = async (req, res) =>
  res.json(await Order.find({ user: req.user._id }).sort("-createdAt"));
