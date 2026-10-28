import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: "text" },
    slug: { type: String, unique: true },
    brand: { type: String, required: true, index: true },
    category: {
      type: String,
      required: true,
      enum: ["smartphones", "consoles", "accessories", "laptops", "watches"],
      index: true,
    },
    description: String,
    images: [String],
    colors: [{ name: String, hex: String, images: [String] }],
    storageOptions: [{ size: String, price: Number }], // e.g. "256GB"
    specs: { type: Map, of: String },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    countInStock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
