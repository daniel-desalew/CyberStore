import Product from "../models/Product.js";

// GET /api/products?category=&brand=&minPrice=&maxPrice=&search=&sort=&page=&limit=
export const getProducts = async (req, res) => {
  const {
    category,
    brand,
    minPrice,
    maxPrice,
    search,
    sort,
    page = 1,
    limit = 54,
  } = req.query;
  const filter = {};

  if (category) filter.category = { $in: category.split(",") };
  if (brand) filter.brand = { $in: brand.split(",") };
  if (sort === "deals") filter.$or = [{ featured: true }, { trending: true }];
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) filter.$text = { $search: search };

  const sortMap = {
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    rating: { rating: -1 },
    deals: { featured: -1, trending: -1, rating: -1 },
    newest: { createdAt: -1 },
  };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({
    products,
    total,
    pages: Math.ceil(total / limit),
    page: Number(page),
  });
};

// GET /api/products/featured
export const getFeatured = async (_req, res) => {
  const [featured, trending] = await Promise.all([
    Product.find({ featured: true }).limit(3),
    Product.find({ trending: true }).limit(8),
  ]);
  res.json({ featured, trending });
};

// GET /api/products/filters  -> data for sidebar
export const getFilterOptions = async (_req, res) => {
  const [brands, categories, price] = await Promise.all([
    Product.distinct("brand"),
    Product.distinct("category"),
    Product.aggregate([
      {
        $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } },
      },
    ]),
  ]);
  res.json({ brands, categories, price: price[0] || { min: 0, max: 0 } });
};

// GET /api/products/:id
export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};
