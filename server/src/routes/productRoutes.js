import { Router } from "express";
import {
  getProducts,
  getFeatured,
  getFilterOptions,
  getProduct,
} from "../controllers/productController.js";

const router = Router();

router.get("/featured", getFeatured);
router.get("/filters", getFilterOptions);
router.get("/", getProducts);
router.get("/:id", getProduct);

export default router;
