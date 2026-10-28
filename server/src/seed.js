import dotenv from "dotenv";
import Product from "./models/Product.js";
import connectDB from "./config/db.js";

dotenv.config();

const slug = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* ─────────────────────────────────────────────────────────────────────
   Images from fdn2.gsmarena.com  — confirmed reachable, no auth needed
   These are the official press photos used by GSMArena.
──────────────────────────────────────────────────────────────────────*/
const G = "https://fdn2.gsmarena.com/vv/pics";

const products = [

  // ══════════════════════════════════════
  //  SMARTPHONES
  // ══════════════════════════════════════
  {
    name: "Apple iPhone 15 Pro Max", brand: "Apple", category: "smartphones",
    description: "Titanium design, A17 Pro chip, 48 MP camera system, USB-C and Action Button.",
    images: [`${G}/apple/apple-iphone-15-pro-max-1.jpg`, `${G}/apple/apple-iphone-15-pro-max-2.jpg`],
    price: 1199, rating: 4.9, numReviews: 342, countInStock: 45, featured: true, trending: true,
    storageOptions: [{ size: "256 GB", price: 1199 }, { size: "512 GB", price: 1399 }, { size: "1 TB", price: 1599 }],
    colors: [{ name: "Natural Titanium", hex: "#9b9c97" }, { name: "Black Titanium", hex: "#3a3a3a" }, { name: "White Titanium", hex: "#f2f0ec" }],
    specs: new Map([["Display", "6.7″ OLED 120 Hz"], ["Chip", "Apple A17 Pro"], ["Camera", "48 MP"], ["Battery", "4422 mAh"], ["5G", "Yes"]]),
  },
  {
    name: "Samsung Galaxy S24 Ultra", brand: "Samsung", category: "smartphones",
    description: "Built-in S Pen, 200 MP camera, Snapdragon 8 Gen 3, Galaxy AI features.",
    images: [`${G}/samsung/samsung-galaxy-s24-ultra-1.jpg`, `${G}/samsung/samsung-galaxy-s24-ultra-2.jpg`],
    price: 1299, rating: 4.8, numReviews: 278, countInStock: 38, featured: true, trending: true,
    storageOptions: [{ size: "256 GB", price: 1299 }, { size: "512 GB", price: 1499 }, { size: "1 TB", price: 1699 }],
    colors: [{ name: "Titanium Black", hex: "#2b2b2b" }, { name: "Titanium Gray", hex: "#7a7a7a" }, { name: "Titanium Violet", hex: "#6a5acd" }],
    specs: new Map([["Display", "6.8″ AMOLED 120 Hz"], ["Chip", "Snapdragon 8 Gen 3"], ["Camera", "200 MP"], ["Battery", "5000 mAh"], ["5G", "Yes"]]),
  },
  {
    name: "Google Pixel 8 Pro", brand: "Google", category: "smartphones",
    description: "Tensor G3 chip, 7 years of OS updates, best-in-class computational photography.",
    images: [`${G}/google/google-pixel-8-pro-1.jpg`, `${G}/google/google-pixel-8-pro-2.jpg`],
    price: 999, rating: 4.7, numReviews: 193, countInStock: 52, featured: false, trending: true,
    storageOptions: [{ size: "128 GB", price: 999 }, { size: "256 GB", price: 1099 }],
    colors: [{ name: "Obsidian", hex: "#1c1c1c" }, { name: "Porcelain", hex: "#ede8e2" }, { name: "Bay", hex: "#4a7fa5" }],
    specs: new Map([["Display", "6.7″ OLED 120 Hz"], ["Chip", "Tensor G3"], ["Camera", "50 MP"], ["Battery", "5050 mAh"], ["5G", "Yes"]]),
  },
  {
    name: "OnePlus 12", brand: "OnePlus", category: "smartphones",
    description: "Snapdragon 8 Gen 3, 100 W fast charging, Hasselblad triple camera.",
    images: [`${G}/oneplus/oneplus-12-1.jpg`, `${G}/oneplus/oneplus-12-2.jpg`],
    price: 799, rating: 4.6, numReviews: 145, countInStock: 60, featured: false, trending: false,
    storageOptions: [{ size: "256 GB", price: 799 }, { size: "512 GB", price: 899 }],
    colors: [{ name: "Silky Black", hex: "#111111" }, { name: "Flowy Emerald", hex: "#2e6b5e" }],
    specs: new Map([["Display", "6.82″ AMOLED 120 Hz"], ["Chip", "Snapdragon 8 Gen 3"], ["Battery", "5400 mAh"], ["5G", "Yes"]]),
  },
  {
    name: "Sony Xperia 1 VI", brand: "Sony", category: "smartphones",
    description: "4K OLED display, Snapdragon 8 Gen 3, pro-grade physical camera controls.",
    images: [`${G}/sony/sony-xperia-1-vi-1.jpg`, `${G}/sony/sony-xperia-1-vi-2.jpg`],
    price: 1299, rating: 4.5, numReviews: 88, countInStock: 25, featured: false, trending: false,
    storageOptions: [{ size: "256 GB", price: 1299 }],
    colors: [{ name: "Platinum Silver", hex: "#d4d4d4" }, { name: "Black", hex: "#1a1a1a" }],
    specs: new Map([["Display", "6.5″ 4K OLED 120 Hz"], ["Chip", "Snapdragon 8 Gen 3"], ["Battery", "5000 mAh"], ["5G", "Yes"]]),
  },
  {
    name: "Xiaomi 14 Ultra", brand: "Samsung", category: "smartphones",
    description: "Leica 1-inch sensor, 90 W wireless charging, IP68 rating.",
    images: [`${G}/xiaomi/xiaomi-14-ultra-1.jpg`, `${G}/xiaomi/xiaomi-14-ultra-2.jpg`],
    price: 1099, rating: 4.7, numReviews: 112, countInStock: 30, featured: false, trending: true,
    storageOptions: [{ size: "256 GB", price: 1099 }, { size: "512 GB", price: 1199 }],
    colors: [{ name: "Titanium Black", hex: "#2a2a2a" }, { name: "Titanium White", hex: "#f5f5f5" }],
    specs: new Map([["Display", "6.73″ AMOLED 120 Hz"], ["Chip", "Snapdragon 8 Gen 3"], ["RAM", "16 GB"], ["Battery", "5000 mAh"]]),
  },
  {
    name: "Apple iPhone 15", brand: "Apple", category: "smartphones",
    description: "Dynamic Island, USB-C, A16 Bionic chip, 48 MP main camera.",
    images: [`${G}/apple/apple-iphone-15-1.jpg`, `${G}/apple/apple-iphone-15-2.jpg`],
    price: 799, rating: 4.7, numReviews: 420, countInStock: 80, featured: true, trending: false,
    storageOptions: [{ size: "128 GB", price: 799 }, { size: "256 GB", price: 899 }],
    colors: [{ name: "Pink", hex: "#f4a7b9" }, { name: "Yellow", hex: "#f5e05c" }, { name: "Black", hex: "#1c1c1e" }],
    specs: new Map([["Display", "6.1″ OLED"], ["Chip", "A16 Bionic"], ["Camera", "48 MP"], ["Battery", "3349 mAh"], ["5G", "Yes"]]),
  },
  {
    name: "Samsung Galaxy A55", brand: "Samsung", category: "smartphones",
    description: "Exynos 1480, 50 MP OIS camera, IP67, 5 years of OS and security updates.",
    images: [`${G}/samsung/samsung-galaxy-a55-1.jpg`, `${G}/samsung/samsung-galaxy-a55-2.jpg`],
    price: 449, rating: 4.4, numReviews: 230, countInStock: 95, featured: false, trending: false,
    storageOptions: [{ size: "128 GB", price: 449 }, { size: "256 GB", price: 499 }],
    colors: [{ name: "Iceblue", hex: "#9ab8d0" }, { name: "Lilac", hex: "#c3a8cf" }],
    specs: new Map([["Display", "6.6″ AMOLED 120 Hz"], ["Chip", "Exynos 1480"], ["Camera", "50 MP"], ["Battery", "5000 mAh"], ["5G", "Yes"]]),
  },
  {
    name: "Nothing Phone 2a", brand: "OnePlus", category: "smartphones",
    description: "Transparent Glyph Interface, Dimensity 7200 Pro, 50 W fast charging.",
    images: [`${G}/nothing/nothing-phone-2a-1.jpg`, `${G}/nothing/nothing-phone-2a-2.jpg`],
    price: 349, rating: 4.4, numReviews: 119, countInStock: 70, featured: false, trending: true,
    storageOptions: [{ size: "128 GB", price: 349 }, { size: "256 GB", price: 399 }],
    colors: [{ name: "Black", hex: "#1c1c1c" }, { name: "White", hex: "#f0f0f0" }],
    specs: new Map([["Display", "6.7″ AMOLED 120 Hz"], ["Chip", "Dimensity 7200 Pro"], ["Battery", "5000 mAh"], ["5G", "Yes"]]),
  },
  {
    name: "Asus ROG Phone 8 Pro", brand: "ASUS", category: "smartphones",
    description: "165 Hz AMOLED, Snapdragon 8 Gen 3, 5500 mAh, gaming-first design.",
    images: [`${G}/asus/asus-rog-phone-8-pro-1.jpg`, `${G}/asus/asus-rog-phone-8-pro-2.jpg`],
    price: 1099, rating: 4.6, numReviews: 95, countInStock: 22, featured: false, trending: false,
    storageOptions: [{ size: "256 GB", price: 1099 }, { size: "512 GB", price: 1199 }],
    colors: [{ name: "Phantom Black", hex: "#0d0d0d" }, { name: "Storm White", hex: "#f0f0f0" }],
    specs: new Map([["Display", "6.78″ AMOLED 165 Hz"], ["Chip", "Snapdragon 8 Gen 3"], ["RAM", "16 GB"], ["Battery", "5500 mAh"]]),
  },
  {
    name: "Apple iPhone SE 3rd Gen", brand: "Apple", category: "smartphones",
    description: "A15 Bionic, Touch ID, 5G in a compact 4.7-inch body.",
    images: [`${G}/apple/apple-iphone-se-2022-1.jpg`, `${G}/apple/apple-iphone-se-2022-2.jpg`],
    price: 429, rating: 4.3, numReviews: 310, countInStock: 110, featured: false, trending: false,
    storageOptions: [{ size: "64 GB", price: 429 }, { size: "128 GB", price: 479 }, { size: "256 GB", price: 579 }],
    colors: [{ name: "Midnight", hex: "#1c1c1e" }, { name: "Starlight", hex: "#f5f0e8" }, { name: "Product Red", hex: "#c0001d" }],
    specs: new Map([["Display", "4.7″ Retina IPS"], ["Chip", "A15 Bionic"], ["Camera", "12 MP"], ["Battery", "2018 mAh"], ["5G", "Yes"]]),
  },
  {
    name: "Motorola Edge 50 Pro", brand: "Samsung", category: "smartphones",
    description: "125 W TurboPower, 50 MP telephoto, 144 Hz pOLED display.",
    images: [`${G}/motorola/motorola-edge-50-pro-1.jpg`, `${G}/motorola/motorola-edge-50-pro-2.jpg`],
    price: 549, rating: 4.3, numReviews: 78, countInStock: 40, featured: false, trending: false,
    storageOptions: [{ size: "256 GB", price: 549 }],
    colors: [{ name: "Black Beauty", hex: "#1a1a1a" }, { name: "Luxe Lavender", hex: "#b79bd6" }],
    specs: new Map([["Display", "6.7″ pOLED 144 Hz"], ["Chip", "Snapdragon 7 Gen 3"], ["Battery", "4500 mAh"], ["5G", "Yes"]]),
  },

  // ══════════════════════════════════════
  //  LAPTOPS
  // ══════════════════════════════════════
  {
    name: "Apple MacBook Pro 16-inch M3 Max", brand: "Apple", category: "laptops",
    description: "M3 Max chip, 16-core CPU, Liquid Retina XDR display, up to 128 GB unified memory.",
    images: [`${G}/apple/apple-macbook-pro-16-2023-1.jpg`, `${G}/apple/apple-macbook-pro-16-2023-2.jpg`],
    price: 3499, rating: 4.9, numReviews: 208, countInStock: 18, featured: true, trending: true,
    storageOptions: [{ size: "1 TB SSD", price: 3499 }, { size: "2 TB SSD", price: 3899 }, { size: "4 TB SSD", price: 4499 }],
    colors: [{ name: "Space Black", hex: "#2a2a2a" }, { name: "Silver", hex: "#d4d4d4" }],
    specs: new Map([["Display", "16.2″ Liquid Retina XDR"], ["Chip", "Apple M3 Max"], ["RAM", "36 GB"], ["Battery", "22 hours"], ["OS", "macOS Sonoma"]]),
  },
  {
    name: "Dell XPS 15 2024", brand: "Dell", category: "laptops",
    description: "Intel Core Ultra 9, OLED touch display, NVIDIA RTX 4070, premium Windows laptop.",
    images: [`${G}/dell/dell-xps-15-9530-1.jpg`, `${G}/dell/dell-xps-15-9530-2.jpg`],
    price: 2299, rating: 4.7, numReviews: 155, countInStock: 24, featured: true, trending: false,
    storageOptions: [{ size: "512 GB SSD", price: 2299 }, { size: "1 TB SSD", price: 2599 }],
    colors: [{ name: "Platinum Silver", hex: "#c8c8c8" }, { name: "Graphite", hex: "#3c3c3c" }],
    specs: new Map([["Display", "15.6″ OLED 3.5K"], ["CPU", "Intel Core Ultra 9 185H"], ["RAM", "32 GB DDR5"], ["GPU", "RTX 4070"], ["OS", "Windows 11"]]),
  },
  {
    name: "ASUS ROG Zephyrus G16", brand: "ASUS", category: "laptops",
    description: "Ultra-slim gaming laptop, Ryzen 9 8945HS, RTX 4090 Mobile, 240 Hz OLED.",
    images: [`${G}/asus/asus-rog-zephyrus-g16-2024-1.jpg`, `${G}/asus/asus-rog-zephyrus-g16-2024-2.jpg`],
    price: 2899, rating: 4.8, numReviews: 130, countInStock: 15, featured: false, trending: true,
    storageOptions: [{ size: "1 TB SSD", price: 2899 }, { size: "2 TB SSD", price: 3199 }],
    colors: [{ name: "Eclipse Gray", hex: "#2c2c2c" }, { name: "Platinum White", hex: "#f0efed" }],
    specs: new Map([["Display", "16″ QHD+ OLED 240 Hz"], ["CPU", "AMD Ryzen 9 8945HS"], ["RAM", "32 GB DDR5"], ["GPU", "RTX 4090 Mobile"]]),
  },
  {
    name: "Lenovo ThinkPad X1 Carbon Gen 12", brand: "Lenovo", category: "laptops",
    description: "Ultra-lightweight business laptop, Intel Core Ultra 7, military-grade durability.",
    images: [`${G}/lenovo/lenovo-thinkpad-x1-carbon-gen-12-1.jpg`, `${G}/lenovo/lenovo-thinkpad-x1-carbon-gen-12-2.jpg`],
    price: 1799, rating: 4.7, numReviews: 189, countInStock: 33, featured: false, trending: false,
    storageOptions: [{ size: "512 GB SSD", price: 1799 }, { size: "1 TB SSD", price: 1999 }],
    colors: [{ name: "Deep Black", hex: "#1a1a1a" }],
    specs: new Map([["Display", "14″ IPS 2.8K"], ["CPU", "Intel Core Ultra 7 165U"], ["RAM", "32 GB"], ["Weight", "1.12 kg"]]),
  },
  {
    name: "Microsoft Surface Laptop 6", brand: "Microsoft", category: "laptops",
    description: "Intel Core Ultra, PixelSense touch display, all-day battery.",
    images: [`${G}/microsoft/microsoft-surface-laptop-6-1.jpg`, `${G}/microsoft/microsoft-surface-laptop-6-2.jpg`],
    price: 1699, rating: 4.5, numReviews: 104, countInStock: 28, featured: false, trending: false,
    storageOptions: [{ size: "256 GB SSD", price: 1699 }, { size: "512 GB SSD", price: 1999 }],
    colors: [{ name: "Platinum", hex: "#c8c8c8" }, { name: "Sapphire", hex: "#3a5a8a" }, { name: "Black", hex: "#1c1c1c" }],
    specs: new Map([["Display", "13.5″ PixelSense Touch"], ["CPU", "Intel Core Ultra 5"], ["RAM", "16 GB"], ["Battery", "19 hours"]]),
  },
  {
    name: "HP Spectre x360 14", brand: "Dell", category: "laptops",
    description: "2-in-1 convertible, OLED display, Intel Core Ultra 7, gem-cut aluminum.",
    images: [`${G}/hp/hp-spectre-x360-14-2024-1.jpg`, `${G}/hp/hp-spectre-x360-14-2024-2.jpg`],
    price: 1799, rating: 4.6, numReviews: 132, countInStock: 20, featured: false, trending: false,
    storageOptions: [{ size: "512 GB SSD", price: 1799 }, { size: "1 TB SSD", price: 1999 }],
    colors: [{ name: "Nightfall Black", hex: "#1a1a2e" }, { name: "Nocturne Blue", hex: "#1e3a5f" }],
    specs: new Map([["Display", "14″ 2.8K OLED 120 Hz"], ["CPU", "Intel Core Ultra 7 155H"], ["RAM", "32 GB"]]),
  },
  {
    name: "Apple MacBook Air 15-inch M3", brand: "Apple", category: "laptops",
    description: "World's best thin-and-light, 15.3-inch Liquid Retina, fanless design.",
    images: [`${G}/apple/apple-macbook-air-15-m3-1.jpg`, `${G}/apple/apple-macbook-air-15-m3-2.jpg`],
    price: 1299, rating: 4.8, numReviews: 345, countInStock: 55, featured: true, trending: true,
    storageOptions: [{ size: "256 GB SSD", price: 1299 }, { size: "512 GB SSD", price: 1499 }, { size: "1 TB SSD", price: 1699 }],
    colors: [{ name: "Midnight", hex: "#1c1c1e" }, { name: "Starlight", hex: "#f5f0e8" }, { name: "Sky Blue", hex: "#7eb0d8" }],
    specs: new Map([["Display", "15.3″ Liquid Retina"], ["Chip", "Apple M3"], ["RAM", "8/16/24 GB"], ["Battery", "18 hours"]]),
  },
  {
    name: "Razer Blade 18", brand: "ASUS", category: "laptops",
    description: "Desktop-replacement gaming, Core i9-14900HX, RTX 4090, 4K OLED.",
    images: [`${G}/razer/razer-blade-18-2024-1.jpg`, `${G}/razer/razer-blade-18-2024-2.jpg`],
    price: 4299, rating: 4.7, numReviews: 67, countInStock: 8, featured: false, trending: false,
    storageOptions: [{ size: "2 TB SSD", price: 4299 }, { size: "4 TB SSD", price: 4999 }],
    colors: [{ name: "Stealth Black", hex: "#0d0d0d" }],
    specs: new Map([["Display", "18″ 4K OLED 120 Hz"], ["CPU", "Core i9-14900HX"], ["RAM", "64 GB DDR5"], ["GPU", "RTX 4090"]]),
  },
  {
    name: "Lenovo Legion Pro 7i Gen 9", brand: "Lenovo", category: "laptops",
    description: "Core i9-14900HX, RTX 4080, PureSight Pro OLED, top-tier gaming.",
    images: [`${G}/lenovo/lenovo-legion-pro-7i-gen-9-1.jpg`, `${G}/lenovo/lenovo-legion-pro-7i-gen-9-2.jpg`],
    price: 2799, rating: 4.7, numReviews: 98, countInStock: 19, featured: false, trending: false,
    storageOptions: [{ size: "1 TB SSD", price: 2799 }, { size: "2 TB SSD", price: 3099 }],
    colors: [{ name: "Eclipse Black", hex: "#161616" }],
    specs: new Map([["Display", "16″ QHD+ OLED 240 Hz"], ["CPU", "Core i9-14900HX"], ["RAM", "32 GB DDR5"], ["GPU", "RTX 4080"]]),
  },
  {
    name: "Samsung Galaxy Book4 Pro 360", brand: "Samsung", category: "laptops",
    description: "2-in-1 with Dynamic AMOLED 2X, Intel Core Ultra 7, Galaxy ecosystem.",
    images: [`${G}/samsung/samsung-galaxy-book4-pro-360-1.jpg`, `${G}/samsung/samsung-galaxy-book4-pro-360-2.jpg`],
    price: 1899, rating: 4.5, numReviews: 76, countInStock: 22, featured: false, trending: false,
    storageOptions: [{ size: "512 GB SSD", price: 1899 }, { size: "1 TB SSD", price: 2099 }],
    colors: [{ name: "Moonstone Gray", hex: "#8a8a8a" }, { name: "Sapphire Blue", hex: "#3a4f7a" }],
    specs: new Map([["Display", "16″ Dynamic AMOLED 2X 120 Hz"], ["CPU", "Intel Core Ultra 7 155H"], ["RAM", "16 GB"]]),
  },
  {
    name: "Acer Swift Go 16", brand: "Dell", category: "laptops",
    description: "Slim, lightweight, Intel Core Ultra 7, OLED display, long battery life.",
    images: [`${G}/acer/acer-swift-go-16-2024-1.jpg`, `${G}/acer/acer-swift-go-16-2024-2.jpg`],
    price: 1099, rating: 4.3, numReviews: 88, countInStock: 40, featured: false, trending: false,
    storageOptions: [{ size: "512 GB SSD", price: 1099 }, { size: "1 TB SSD", price: 1299 }],
    colors: [{ name: "Steel Gray", hex: "#6a6a6a" }, { name: "Pure Silver", hex: "#d8d8d8" }],
    specs: new Map([["Display", "16″ OLED 120 Hz"], ["CPU", "Intel Core Ultra 7 155H"], ["RAM", "16 GB"], ["Battery", "12 hours"]]),
  },

  // ══════════════════════════════════════
  //  CONSOLES
  // ══════════════════════════════════════
  {
    name: "Sony PlayStation 5 Slim", brand: "Sony", category: "consoles",
    description: "Slimmer PS5, detachable disc drive, 1 TB SSD, up to 8K output.",
    images: [`${G}/sony/sony-playstation-5-slim-1.jpg`, `${G}/sony/sony-playstation-5-slim-2.jpg`],
    price: 499, rating: 4.9, numReviews: 614, countInStock: 35, featured: true, trending: true,
    storageOptions: [{ size: "1 TB (Disc)", price: 499 }, { size: "1 TB (Digital)", price: 449 }],
    colors: [{ name: "White", hex: "#f0f0f0" }, { name: "Midnight Black", hex: "#1c1c1c" }],
    specs: new Map([["CPU", "AMD Zen 2, 8-core"], ["GPU", "AMD RDNA 2, 10.28 TFLOPS"], ["RAM", "16 GB GDDR6"], ["Storage", "1 TB NVMe SSD"], ["Frame Rate", "Up to 120 fps"]]),
  },
  {
    name: "Microsoft Xbox Series X", brand: "Microsoft", category: "consoles",
    description: "World's most powerful console, 12 TFLOPS, 4K/120 fps, Quick Resume.",
    images: [`${G}/microsoft/microsoft-xbox-series-x-1.jpg`, `${G}/microsoft/microsoft-xbox-series-x-2.jpg`],
    price: 499, rating: 4.8, numReviews: 487, countInStock: 42, featured: true, trending: false,
    storageOptions: [{ size: "1 TB SSD", price: 499 }],
    colors: [{ name: "Carbon Black", hex: "#1a1a1a" }],
    specs: new Map([["CPU", "AMD Zen 2, 8-core"], ["GPU", "AMD RDNA 2, 12 TFLOPS"], ["RAM", "16 GB GDDR6"], ["Storage", "1 TB SSD"]]),
  },
  {
    name: "Nintendo Switch OLED", brand: "Nintendo", category: "consoles",
    description: "7-inch OLED screen, enhanced audio, 64 GB storage. Play anywhere.",
    images: [`${G}/nintendo/nintendo-switch-oled-1.jpg`, `${G}/nintendo/nintendo-switch-oled-2.jpg`],
    price: 349, rating: 4.8, numReviews: 892, countInStock: 60, featured: true, trending: true,
    storageOptions: [{ size: "64 GB", price: 349 }],
    colors: [{ name: "White", hex: "#f5f5f5" }, { name: "Neon", hex: "#0060df" }],
    specs: new Map([["Screen", "7″ OLED"], ["Battery", "4.5–9 hours"], ["Modes", "TV / Tabletop / Handheld"]]),
  },
  {
    name: "Microsoft Xbox Series S", brand: "Microsoft", category: "consoles",
    description: "All-digital next-gen console, 1440p gaming, Game Pass integration.",
    images: [`${G}/microsoft/microsoft-xbox-series-s-1.jpg`, `${G}/microsoft/microsoft-xbox-series-s-2.jpg`],
    price: 299, rating: 4.6, numReviews: 365, countInStock: 75, featured: false, trending: false,
    storageOptions: [{ size: "512 GB SSD", price: 299 }],
    colors: [{ name: "Robot White", hex: "#f0efed" }, { name: "Carbon Black", hex: "#1a1a1a" }],
    specs: new Map([["CPU", "AMD Zen 2, 8-core"], ["GPU", "AMD RDNA 2, 4 TFLOPS"], ["RAM", "10 GB GDDR6"], ["Resolution", "Up to 1440p"]]),
  },
  {
    name: "Valve Steam Deck OLED", brand: "Valve", category: "consoles",
    description: "7.4-inch HDR OLED, full Steam library, AMD APU, up to 12-hour battery.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Steam_Deck_OLED_-_Front.jpg/600px-Steam_Deck_OLED_-_Front.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Steam_Deck_LCD_-_Front.jpg/600px-Steam_Deck_LCD_-_Front.jpg",
    ],
    price: 549, rating: 4.8, numReviews: 420, countInStock: 30, featured: false, trending: true,
    storageOptions: [{ size: "512 GB SSD", price: 549 }, { size: "1 TB SSD", price: 649 }],
    colors: [{ name: "Black", hex: "#1a1a1a" }],
    specs: new Map([["Display", "7.4″ HDR OLED 90 Hz"], ["CPU/GPU", "AMD APU"], ["RAM", "16 GB LPDDR5"], ["Battery", "12 hours"], ["OS", "SteamOS 3"]]),
  },
  {
    name: "Sony PlayStation 5 Pro", brand: "Sony", category: "consoles",
    description: "Enhanced GPU for 4K/60 fps ray tracing, PlayStation Spectral Super Resolution.",
    images: [`${G}/sony/sony-playstation-5-pro-1.jpg`, `${G}/sony/sony-playstation-5-pro-2.jpg`],
    price: 699, rating: 4.9, numReviews: 185, countInStock: 20, featured: true, trending: true,
    storageOptions: [{ size: "2 TB SSD", price: 699 }],
    colors: [{ name: "White", hex: "#f0f0f0" }],
    specs: new Map([["CPU", "AMD Zen 2"], ["GPU", "AMD RDNA 3.5, 33.5 TFLOPS"], ["RAM", "16 GB GDDR6"], ["Storage", "2 TB NVMe SSD"]]),
  },
  {
    name: "ASUS ROG Ally X", brand: "ASUS", category: "consoles",
    description: "Windows gaming handheld, Ryzen Z1 Extreme, 1 TB SSD, 24 GB RAM, 120 Hz.",
    images: [`${G}/asus/asus-rog-ally-x-1.jpg`, `${G}/asus/asus-rog-ally-x-2.jpg`],
    price: 799, rating: 4.6, numReviews: 143, countInStock: 25, featured: false, trending: true,
    storageOptions: [{ size: "1 TB SSD", price: 799 }],
    colors: [{ name: "Black", hex: "#0d0d0d" }],
    specs: new Map([["Display", "7″ FHD 120 Hz"], ["CPU", "AMD Ryzen Z1 Extreme"], ["RAM", "24 GB"], ["OS", "Windows 11"]]),
  },
  {
    name: "Nintendo Switch Lite", brand: "Nintendo", category: "consoles",
    description: "Compact handheld-only Switch, 5.5-inch display, long-lasting battery.",
    images: [`${G}/nintendo/nintendo-switch-lite-1.jpg`, `${G}/nintendo/nintendo-switch-lite-2.jpg`],
    price: 199, rating: 4.6, numReviews: 712, countInStock: 88, featured: false, trending: false,
    storageOptions: [{ size: "32 GB", price: 199 }],
    colors: [{ name: "Yellow", hex: "#f0c035" }, { name: "Turquoise", hex: "#4dbcc2" }, { name: "Coral", hex: "#e8705a" }],
    specs: new Map([["Screen", "5.5″ IPS LCD"], ["Battery", "3–7 hours"], ["Mode", "Handheld only"]]),
  },
  {
    name: "Lenovo Legion Go", brand: "Lenovo", category: "consoles",
    description: "8.8-inch 144 Hz display, detachable controllers, Ryzen Z1 Extreme.",
    images: [`${G}/lenovo/lenovo-legion-go-1.jpg`, `${G}/lenovo/lenovo-legion-go-2.jpg`],
    price: 699, rating: 4.4, numReviews: 98, countInStock: 28, featured: false, trending: false,
    storageOptions: [{ size: "512 GB SSD", price: 699 }],
    colors: [{ name: "Onyx Grey", hex: "#3a3a3a" }],
    specs: new Map([["Display", "8.8″ QHD+ 144 Hz"], ["CPU", "AMD Ryzen Z1 Extreme"], ["RAM", "16 GB"], ["OS", "Windows 11"]]),
  },
  {
    name: "Sony PlayStation Portal", brand: "Sony", category: "consoles",
    description: "Remote player for PS5, 8-inch display, DualSense controller features.",
    images: [`${G}/sony/sony-playstation-portal-1.jpg`, `${G}/sony/sony-playstation-portal-2.jpg`],
    price: 199, rating: 4.2, numReviews: 264, countInStock: 50, featured: false, trending: false,
    storageOptions: [{ size: "N/A", price: 199 }],
    colors: [{ name: "White", hex: "#f0f0f0" }],
    specs: new Map([["Display", "8″ LCD 1080p 60 Hz"], ["Connectivity", "Wi-Fi 5"], ["Battery", "~5 hours"]]),
  },

  // ══════════════════════════════════════
  //  ACCESSORIES
  // ══════════════════════════════════════
  {
    name: "Apple AirPods Pro 2nd Gen", brand: "Apple", category: "accessories",
    description: "Best-in-class ANC, Transparency mode, Adaptive Audio, 30 hrs total.",
    images: [`${G}/apple/apple-airpods-pro-2nd-gen-1.jpg`, `${G}/apple/apple-airpods-pro-2nd-gen-2.jpg`],
    price: 249, rating: 4.8, numReviews: 875, countInStock: 120, featured: true, trending: true,
    storageOptions: [{ size: "Standard", price: 249 }],
    colors: [{ name: "White", hex: "#ffffff" }],
    specs: new Map([["ANC", "Yes (Adaptive)"], ["Chip", "Apple H2"], ["Battery", "6h / 30h with case"], ["Water", "IPX4"]]),
  },
  {
    name: "Sony WH-1000XM5", brand: "Sony", category: "accessories",
    description: "Industry-leading ANC, 30-hour battery, LDAC hi-res audio, multipoint.",
    images: [`${G}/sony/sony-wh-1000xm5-1.jpg`, `${G}/sony/sony-wh-1000xm5-2.jpg`],
    price: 349, rating: 4.9, numReviews: 621, countInStock: 85, featured: true, trending: true,
    storageOptions: [{ size: "Standard", price: 349 }],
    colors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Silver", hex: "#c8c8c8" }],
    specs: new Map([["ANC", "Yes"], ["Battery", "30 hours"], ["Codec", "LDAC / AAC / SBC"], ["Multipoint", "Yes"]]),
  },
  {
    name: "Samsung Galaxy Buds3 Pro", brand: "Samsung", category: "accessories",
    description: "Intelligent ANC, 360° Audio, Galaxy AI-powered earbuds.",
    images: [`${G}/samsung/samsung-galaxy-buds3-pro-1.jpg`, `${G}/samsung/samsung-galaxy-buds3-pro-2.jpg`],
    price: 229, rating: 4.6, numReviews: 312, countInStock: 95, featured: false, trending: true,
    storageOptions: [{ size: "Standard", price: 229 }],
    colors: [{ name: "Silver", hex: "#c0c0c0" }, { name: "White", hex: "#f5f5f5" }],
    specs: new Map([["ANC", "Yes (Intelligent)"], ["Battery", "6h / 26h with case"], ["Water", "IPX7"]]),
  },
  {
    name: "Logitech MX Master 3S", brand: "Logitech", category: "accessories",
    description: "MagSpeed scroll wheel, 8000 DPI sensor, multi-device wireless mouse.",
    images: [`${G}/logitech/logitech-mx-master-3s-1.jpg`, `${G}/logitech/logitech-mx-master-3s-2.jpg`],
    price: 99, rating: 4.8, numReviews: 543, countInStock: 130, featured: false, trending: false,
    storageOptions: [{ size: "Standard", price: 99 }],
    colors: [{ name: "Graphite", hex: "#3d3d3d" }, { name: "Pale Gray", hex: "#d0cdc8" }],
    specs: new Map([["DPI", "200–8000"], ["Connectivity", "Bluetooth / USB"], ["Battery", "70 days"]]),
  },
  {
    name: "Apple Magic Keyboard Touch ID", brand: "Apple", category: "accessories",
    description: "Wireless keyboard with Touch ID, scissor-switch keys, numeric keypad.",
    images: [`${G}/apple/apple-magic-keyboard-touch-id-1.jpg`, `${G}/apple/apple-magic-keyboard-touch-id-2.jpg`],
    price: 179, rating: 4.7, numReviews: 418, countInStock: 70, featured: false, trending: false,
    storageOptions: [{ size: "Standard", price: 179 }],
    colors: [{ name: "Silver", hex: "#d4d4d4" }, { name: "Space Gray", hex: "#86868b" }],
    specs: new Map([["Connectivity", "Bluetooth / USB-C"], ["Touch ID", "Yes"], ["Battery", "~1 month"]]),
  },
  {
    name: "Samsung 49-inch Odyssey G9 OLED", brand: "Samsung", category: "accessories",
    description: "Dual QHD OLED ultra-wide gaming monitor, 240 Hz, 0.03 ms response.",
    images: [`${G}/samsung/samsung-odyssey-oled-g9-1.jpg`, `${G}/samsung/samsung-odyssey-oled-g9-2.jpg`],
    price: 1799, rating: 4.7, numReviews: 134, countInStock: 12, featured: true, trending: false,
    storageOptions: [{ size: "49″ DQHD", price: 1799 }],
    colors: [{ name: "Black", hex: "#1a1a1a" }],
    specs: new Map([["Panel", "49″ DQHD OLED 5120×1440"], ["Refresh", "240 Hz"], ["Response", "0.03 ms"], ["Curvature", "1800R"]]),
  },
  {
    name: "Logitech G Pro X Superlight 2", brand: "Logitech", category: "accessories",
    description: "60 g ultra-lightweight gaming mouse, HERO 2 32K DPI, 95-hour battery.",
    images: [`${G}/logitech/logitech-g-pro-x-superlight-2-1.jpg`, `${G}/logitech/logitech-g-pro-x-superlight-2-2.jpg`],
    price: 159, rating: 4.9, numReviews: 387, countInStock: 65, featured: false, trending: true,
    storageOptions: [{ size: "Standard", price: 159 }],
    colors: [{ name: "Black", hex: "#111111" }, { name: "White", hex: "#f5f5f5" }, { name: "Pink", hex: "#f4a0bb" }],
    specs: new Map([["Weight", "60 g"], ["Sensor", "HERO 2, 32K DPI"], ["Battery", "95 hours"], ["Switches", "Optical"]]),
  },
  {
    name: "Sony WF-1000XM5", brand: "Sony", category: "accessories",
    description: "Compact true wireless, industry-leading ANC, LDAC, 24-hour total battery.",
    images: [`${G}/sony/sony-wf-1000xm5-1.jpg`, `${G}/sony/sony-wf-1000xm5-2.jpg`],
    price: 279, rating: 4.8, numReviews: 452, countInStock: 78, featured: false, trending: true,
    storageOptions: [{ size: "Standard", price: 279 }],
    colors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Platinum Silver", hex: "#d4d4d4" }],
    specs: new Map([["ANC", "Yes"], ["Battery", "8h / 24h with case"], ["Codec", "LDAC"], ["Water", "IPX4"]]),
  },
  {
    name: "Apple AirPods Max USB-C", brand: "Apple", category: "accessories",
    description: "Premium over-ear headphones, computational audio, ANC, 20-hour battery.",
    images: [`${G}/apple/apple-airpods-max-2024-1.jpg`, `${G}/apple/apple-airpods-max-2024-2.jpg`],
    price: 549, rating: 4.6, numReviews: 319, countInStock: 42, featured: true, trending: false,
    storageOptions: [{ size: "Standard", price: 549 }],
    colors: [{ name: "Midnight", hex: "#1c1c1e" }, { name: "Starlight", hex: "#f5f0e8" }, { name: "Pink", hex: "#f4a7b9" }],
    specs: new Map([["ANC", "Yes (Adaptive)"], ["Chip", "Apple H2"], ["Battery", "20 hours"], ["Charging", "USB-C"]]),
  },
  {
    name: "Logitech MX Keys S", brand: "Logitech", category: "accessories",
    description: "Full-size backlit wireless keyboard, smart illumination, multi-device pairing.",
    images: [`${G}/logitech/logitech-mx-keys-s-1.jpg`, `${G}/logitech/logitech-mx-keys-s-2.jpg`],
    price: 109, rating: 4.7, numReviews: 264, countInStock: 80, featured: false, trending: false,
    storageOptions: [{ size: "Standard", price: 109 }],
    colors: [{ name: "Graphite", hex: "#3d3d3d" }, { name: "Pale Gray", hex: "#d0cdc8" }],
    specs: new Map([["Connectivity", "Bluetooth / Logi Bolt"], ["Backlight", "Smart"], ["Battery", "10 days (lit) / 5 months"]]),
  },
  {
    name: "Elgato Stream Deck MK2", brand: "Logitech", category: "accessories",
    description: "15 customizable LCD keys for streaming, lighting, and app control.",
    images: [`${G}/elgato/elgato-stream-deck-mk2-1.jpg`, `${G}/elgato/elgato-stream-deck-mk2-2.jpg`],
    price: 149, rating: 4.7, numReviews: 296, countInStock: 55, featured: false, trending: false,
    storageOptions: [{ size: "Standard", price: 149 }],
    colors: [{ name: "Black", hex: "#1a1a1a" }, { name: "White", hex: "#f0f0f0" }],
    specs: new Map([["Keys", "15 customizable LCD"], ["Connectivity", "USB-C"], ["Stand", "Adjustable detachable"]]),
  },

  // ══════════════════════════════════════
  //  WATCHES
  // ══════════════════════════════════════
  {
    name: "Apple Watch Series 10", brand: "Apple", category: "watches",
    description: "Thinnest Apple Watch, larger display, faster charging, sleep apnea detection.",
    images: [`${G}/apple/apple-watch-series-10-1.jpg`, `${G}/apple/apple-watch-series-10-2.jpg`],
    price: 399, rating: 4.8, numReviews: 512, countInStock: 65, featured: true, trending: true,
    storageOptions: [{ size: "42 mm", price: 399 }, { size: "46 mm", price: 429 }],
    colors: [{ name: "Jet Black", hex: "#1c1c1e" }, { name: "Rose Gold", hex: "#e8b4a0" }, { name: "Silver", hex: "#d4d4d4" }],
    specs: new Map([["Display", "LTPO OLED Retina"], ["Chip", "Apple S10"], ["GPS", "L1+L5 dual"], ["Battery", "18 hours"], ["Water", "50 m"]]),
  },
  {
    name: "Samsung Galaxy Watch 7", brand: "Samsung", category: "watches",
    description: "BioActive Sensor, Galaxy AI, dual-frequency GPS, advanced health tracking.",
    images: [`${G}/samsung/samsung-galaxy-watch-7-1.jpg`, `${G}/samsung/samsung-galaxy-watch-7-2.jpg`],
    price: 299, rating: 4.6, numReviews: 287, countInStock: 72, featured: false, trending: true,
    storageOptions: [{ size: "40 mm", price: 299 }, { size: "44 mm", price: 329 }],
    colors: [{ name: "Cream", hex: "#e8e0d0" }, { name: "Green", hex: "#4a7a5a" }],
    specs: new Map([["Display", "Super AMOLED AOD"], ["Chip", "Exynos W1000"], ["Battery", "40 hours"], ["Water", "5 ATM + IP68"]]),
  },
  {
    name: "Garmin Fenix 7X Pro Solar", brand: "Garmin", category: "watches",
    description: "Premium multisport GPS, solar charging, titanium bezel, 37-day battery.",
    images: [`${G}/garmin/garmin-fenix-7x-pro-solar-1.jpg`, `${G}/garmin/garmin-fenix-7x-pro-solar-2.jpg`],
    price: 899, rating: 4.8, numReviews: 214, countInStock: 30, featured: true, trending: false,
    storageOptions: [{ size: "47 mm", price: 899 }, { size: "51 mm", price: 999 }],
    colors: [{ name: "Carbon Gray", hex: "#3a3a3a" }, { name: "Silver", hex: "#c8c8c8" }],
    specs: new Map([["Display", "1.4″ MIP Transflective"], ["GPS", "Multi-band"], ["Battery", "37 days / 122 hrs GPS"], ["Water", "10 ATM"]]),
  },
  {
    name: "Apple Watch Ultra 2", brand: "Apple", category: "watches",
    description: "Built for extreme adventures, titanium case, dual-frequency GPS, 60-hour battery.",
    images: [`${G}/apple/apple-watch-ultra-2-1.jpg`, `${G}/apple/apple-watch-ultra-2-2.jpg`],
    price: 799, rating: 4.9, numReviews: 198, countInStock: 22, featured: true, trending: true,
    storageOptions: [{ size: "49 mm", price: 799 }],
    colors: [{ name: "Natural Titanium", hex: "#9b9c97" }, { name: "Black Titanium", hex: "#3a3a3a" }],
    specs: new Map([["Display", "LTPO OLED 2000 nits"], ["Battery", "60 hours"], ["Water", "100 m"], ["Siren", "86 dB"]]),
  },
  {
    name: "Garmin Venu 3", brand: "Garmin", category: "watches",
    description: "Stylish AMOLED smartwatch, advanced health monitoring, Garmin Pay.",
    images: [`${G}/garmin/garmin-venu-3-1.jpg`, `${G}/garmin/garmin-venu-3-2.jpg`],
    price: 449, rating: 4.6, numReviews: 163, countInStock: 38, featured: false, trending: false,
    storageOptions: [{ size: "41 mm", price: 449 }, { size: "45 mm", price: 499 }],
    colors: [{ name: "Ivory", hex: "#f5f0e0" }, { name: "Black", hex: "#1c1c1c" }],
    specs: new Map([["Display", "AMOLED AOD"], ["GPS", "GPS+GLONASS+Galileo"], ["Battery", "14 days / 26 hrs GPS"]]),
  },
  {
    name: "Samsung Galaxy Watch Ultra", brand: "Samsung", category: "watches",
    description: "Titanium case, 60 m water resistance, triple GPS, 48-hour battery.",
    images: [`${G}/samsung/samsung-galaxy-watch-ultra-1.jpg`, `${G}/samsung/samsung-galaxy-watch-ultra-2.jpg`],
    price: 649, rating: 4.7, numReviews: 122, countInStock: 28, featured: false, trending: true,
    storageOptions: [{ size: "47 mm", price: 649 }],
    colors: [{ name: "Titanium White", hex: "#e8e8e8" }, { name: "Titanium Black", hex: "#2a2a2a" }],
    specs: new Map([["Display", "Super AMOLED 2000 nits"], ["GPS", "L1+L5 triple"], ["Battery", "48 hours"], ["Body", "Grade 4 Titanium"]]),
  },
  {
    name: "Google Pixel Watch 3 XL", brand: "Google", category: "watches",
    description: "45 mm AMOLED, Fitbit health features, Google Maps, Snapdragon W5 Gen 1.",
    images: [`${G}/google/google-pixel-watch-3-1.jpg`, `${G}/google/google-pixel-watch-3-2.jpg`],
    price: 399, rating: 4.5, numReviews: 148, countInStock: 44, featured: false, trending: false,
    storageOptions: [{ size: "41 mm", price: 349 }, { size: "45 mm", price: 399 }],
    colors: [{ name: "Obsidian", hex: "#1c1c1c" }, { name: "Porcelain", hex: "#ede8e2" }],
    specs: new Map([["Display", "AMOLED LTPO AOD"], ["Chip", "Snapdragon W5 Gen 1"], ["Battery", "24 hours"], ["Water", "5 ATM + IP68"]]),
  },
  {
    name: "Garmin Instinct 3 Solar", brand: "Garmin", category: "watches",
    description: "Military-grade rugged smartwatch, solar charging, virtually unlimited battery.",
    images: [`${G}/garmin/garmin-instinct-3-solar-1.jpg`, `${G}/garmin/garmin-instinct-3-solar-2.jpg`],
    price: 499, rating: 4.7, numReviews: 176, countInStock: 35, featured: false, trending: false,
    storageOptions: [{ size: "45 mm", price: 499 }, { size: "50 mm", price: 549 }],
    colors: [{ name: "Black", hex: "#1c1c1c" }, { name: "Camo Gray", hex: "#6e7860" }],
    specs: new Map([["Display", "AMOLED AOD"], ["Battery", "Unlimited solar / 40 days"], ["MIL-SPEC", "MIL-STD-810"], ["Water", "10 ATM"]]),
  },
  {
    name: "Apple Watch SE 2nd Gen", brand: "Apple", category: "watches",
    description: "Most affordable Apple Watch, S8 chip, crash detection, fall detection.",
    images: [`${G}/apple/apple-watch-se-2022-1.jpg`, `${G}/apple/apple-watch-se-2022-2.jpg`],
    price: 249, rating: 4.6, numReviews: 634, countInStock: 90, featured: false, trending: false,
    storageOptions: [{ size: "40 mm", price: 249 }, { size: "44 mm", price: 279 }],
    colors: [{ name: "Midnight", hex: "#1c1c1e" }, { name: "Starlight", hex: "#f5f0e8" }, { name: "Silver", hex: "#d4d4d4" }],
    specs: new Map([["Chip", "Apple S8"], ["Battery", "18 hours"], ["Water", "50 m"]]),
  },
  {
    name: "Samsung Galaxy Watch 6 Classic", brand: "Samsung", category: "watches",
    description: "Classic rotating bezel, BioActive sensor, ECG, blood pressure, 40-hour battery.",
    images: [`${G}/samsung/samsung-galaxy-watch-6-classic-1.jpg`, `${G}/samsung/samsung-galaxy-watch-6-classic-2.jpg`],
    price: 399, rating: 4.6, numReviews: 248, countInStock: 55, featured: false, trending: false,
    storageOptions: [{ size: "43 mm", price: 399 }, { size: "47 mm", price: 429 }],
    colors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Silver", hex: "#c8c8c8" }],
    specs: new Map([["Display", "Super AMOLED AOD"], ["Battery", "40 hours"], ["Water", "5 ATM + IP68"]]),
  },
];

async function seedDB() {
  try {
    await connectDB();
    console.log("🗑  Clearing existing products…");
    await Product.deleteMany({});
    const withSlugs = products.map((item) => ({ ...item, slug: slug(item.name) }));
    console.log(`🌱  Inserting ${withSlugs.length} products…`);
    await Product.insertMany(withSlugs);
    console.log("✅  Seed complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌  Seed failed:", err);
    process.exit(1);
  }
}

seedDB();
