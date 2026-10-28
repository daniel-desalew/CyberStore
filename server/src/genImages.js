/**
 * Generates clean SVG product card images for every product
 * that doesn't already have a downloaded photo.
 * Run: node src/genImages.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "../../client/public/products");
fs.mkdirSync(OUT, { recursive: true });

const CATEGORY_STYLES = {
  smartphones: { bg1: "#4f46e5", bg2: "#7c3aed", emoji: "📱", label: "Smartphone" },
  laptops:     { bg1: "#0284c7", bg2: "#0369a1", emoji: "💻", label: "Laptop"     },
  consoles:    { bg1: "#059669", bg2: "#047857", emoji: "🎮", label: "Console"    },
  accessories: { bg1: "#d97706", bg2: "#b45309", emoji: "🎧", label: "Accessory"  },
  watches:     { bg1: "#db2777", bg2: "#be185d", emoji: "⌚", label: "Watch"      },
};

const products = [
  // Smartphones
  { file: "galaxy-s24-ultra.jpg",    name: "Galaxy S24 Ultra",   cat: "smartphones" },
  { file: "moto-edge-50-pro.jpg",    name: "Edge 50 Pro",        cat: "smartphones" },
  // Consoles
  { file: "ps5-slim.jpg",            name: "PlayStation 5 Slim", cat: "consoles"    },
  { file: "xbox-series-x.jpg",       name: "Xbox Series X",      cat: "consoles"    },
  { file: "switch-oled.jpg",         name: "Switch OLED",        cat: "consoles"    },
  { file: "xbox-series-s.jpg",       name: "Xbox Series S",      cat: "consoles"    },
  { file: "steam-deck-oled.jpg",     name: "Steam Deck OLED",    cat: "consoles"    },
  { file: "ps5-pro.jpg",             name: "PlayStation 5 Pro",  cat: "consoles"    },
  { file: "rog-ally-x.jpg",          name: "ROG Ally X",         cat: "consoles"    },
  { file: "switch-lite.jpg",         name: "Switch Lite",        cat: "consoles"    },
  { file: "legion-go.jpg",           name: "Legion Go",          cat: "consoles"    },
  { file: "ps-portal.jpg",           name: "PlayStation Portal", cat: "consoles"    },
  // Watches
  { file: "apple-watch-s10.jpg",     name: "Apple Watch S10",    cat: "watches"     },
  { file: "galaxy-watch-7.jpg",      name: "Galaxy Watch 7",     cat: "watches"     },
  { file: "garmin-fenix-7x.jpg",     name: "Fenix 7X Pro Solar", cat: "watches"     },
  { file: "apple-watch-ultra2.jpg",  name: "Watch Ultra 2",      cat: "watches"     },
  { file: "garmin-venu-3.jpg",       name: "Garmin Venu 3",      cat: "watches"     },
  { file: "galaxy-watch-6-classic.jpg", name: "Watch 6 Classic", cat: "watches"     },
  { file: "pixel-watch-3.jpg",       name: "Pixel Watch 3 XL",   cat: "watches"     },
  { file: "garmin-instinct-3.jpg",   name: "Instinct 3 Solar",   cat: "watches"     },
  { file: "apple-watch-se2.jpg",     name: "Apple Watch SE",     cat: "watches"     },
  // Accessories
  { file: "airpods-pro-2.jpg",       name: "AirPods Pro 2",      cat: "accessories" },
  { file: "sony-wh1000xm5.jpg",      name: "WH-1000XM5",        cat: "accessories" },
  { file: "galaxy-buds3-pro.jpg",    name: "Galaxy Buds3 Pro",   cat: "accessories" },
  { file: "logitech-mx-master-3s.jpg", name: "MX Master 3S",    cat: "accessories" },
  { file: "magic-keyboard.jpg",      name: "Magic Keyboard",     cat: "accessories" },
  { file: "odyssey-g9-oled.jpg",     name: "Odyssey G9 OLED",    cat: "accessories" },
  { file: "gpro-superlight-2.jpg",   name: "G Pro Superlight 2", cat: "accessories" },
  { file: "sony-wf1000xm5.jpg",      name: "WF-1000XM5",        cat: "accessories" },
  { file: "airpods-max.jpg",         name: "AirPods Max",        cat: "accessories" },
  { file: "mx-keys-s.jpg",           name: "MX Keys S",          cat: "accessories" },
  { file: "stream-deck-mk2.jpg",     name: "Stream Deck MK.2",   cat: "accessories" },
];

function makeSVG(name, cat) {
  const s = CATEGORY_STYLES[cat] || CATEGORY_STYLES.accessories;
  // shorten name to fit
  const short = name.length > 18 ? name.slice(0, 17) + "…" : name;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${s.bg1}"/>
      <stop offset="100%" stop-color="${s.bg2}"/>
    </linearGradient>
    <linearGradient id="card" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.05"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="600" height="600" fill="url(#bg)" rx="24"/>
  <!-- Decorative circles -->
  <circle cx="520" cy="80"  r="120" fill="white" fill-opacity="0.06"/>
  <circle cx="80"  cy="520" r="150" fill="white" fill-opacity="0.06"/>
  <circle cx="300" cy="300" r="180" fill="white" fill-opacity="0.04"/>
  <!-- Card container -->
  <rect x="100" y="140" width="400" height="300" rx="28" fill="url(#card)" stroke="white" stroke-opacity="0.2" stroke-width="1.5"/>
  <!-- Emoji icon -->
  <text x="300" y="310" font-size="120" text-anchor="middle" dominant-baseline="middle">${s.emoji}</text>
  <!-- Product name -->
  <text x="300" y="415" font-family="system-ui,-apple-system,sans-serif" font-size="28" font-weight="700"
        fill="white" text-anchor="middle" dominant-baseline="middle">${short}</text>
  <!-- Category label -->
  <rect x="220" y="448" width="160" height="32" rx="16" fill="white" fill-opacity="0.2"/>
  <text x="300" y="464" font-family="system-ui,-apple-system,sans-serif" font-size="14" font-weight="600"
        fill="white" fill-opacity="0.9" text-anchor="middle" dominant-baseline="middle">${s.label}</text>
</svg>`;
}

let generated = 0;
for (const { file, name, cat } of products) {
  const dest = path.join(OUT, file);
  if (fs.existsSync(dest)) {
    console.log(`skip  ${file}`);
    continue;
  }
  // Write as .svg with jpg extension (browsers handle it fine)
  fs.writeFileSync(dest, makeSVG(name, cat), "utf8");
  console.log(`gen   ${file}`);
  generated++;
}

console.log(`\n✅ Generated ${generated} product images.`);
