import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.route("/").get(protect, getCart).post(protect, addToCart);
router.route("/:itemId").put(protect, updateCartItem).delete(protect, removeCartItem);

export default router;
