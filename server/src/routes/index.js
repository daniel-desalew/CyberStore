import { Router } from "express";
import { protect } from "../middleware/auth.js";
import authRoutes from "./authRoutes.js";
import productRoutes from "./productRoutes.js";
import cartRoutes from "./cartRoutes.js";
import { createOrder, getMyOrders } from "../controllers/orderController.js";

const r = Router();

r.use("/auth", authRoutes);
r.use("/products", productRoutes);
r.use("/cart", cartRoutes);

r.route("/orders").post(protect, createOrder).get(protect, getMyOrders);

export default r;
