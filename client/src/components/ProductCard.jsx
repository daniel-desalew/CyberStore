import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const PRODUCT_IMAGES = {
  "Apple iPhone 15 Pro Max": "iphone-15-pro-max.jpg",
  "Samsung Galaxy S24 Ultra": "galaxy-s24-ultra.svg",
  "Google Pixel 8 Pro": "pixel-8-pro.jpg",
  "OnePlus 12": "oneplus-12.jpg",
  "Sony Xperia 1 VI": "xperia-1-vi.jpg",
  "Xiaomi 14 Ultra": "xiaomi-14-ultra.jpg",
  "Apple iPhone 15": "iphone-15.jpg",
  "Samsung Galaxy A55": "galaxy-a55.jpg",
  "Nothing Phone 2a": "nothing-phone-2a.jpg",
  "Asus ROG Phone 8 Pro": "rog-phone-8-pro.jpg",
  "Apple iPhone SE 3rd Gen": "iphone-se-3.jpg",
  "Motorola Edge 50 Pro": "moto-edge-50-pro.svg",
  "Apple MacBook Pro 16-inch M3 Max": "macbook-pro-16.jpg",
  "Dell XPS 15 2024": "dell-xps-15.jpg",
  "ASUS ROG Zephyrus G16": "asus-rog-zephyrus.jpg",
  "Lenovo ThinkPad X1 Carbon Gen 12": "thinkpad-x1.jpg",
  "Microsoft Surface Laptop 6": "surface-laptop-6.jpg",
  "HP Spectre x360 14": "hp-spectre-x360.jpg",
  "Apple MacBook Air 15-inch M3": "macbook-air-m3.jpg",
  "Razer Blade 18": "razer-blade-18.jpg",
  "Lenovo Legion Pro 7i Gen 9": "legion-pro-7i.jpg",
  "Samsung Galaxy Book4 Pro 360": "galaxy-book4-pro.jpg",
  "Acer Swift Go 16": "acer-swift-go.jpg",
  "Sony PlayStation 5 Slim": "ps5-slim.svg",
  "Microsoft Xbox Series X": "xbox-series-x.svg",
  "Nintendo Switch OLED": "switch-oled.svg",
  "Microsoft Xbox Series S": "xbox-series-s.svg",
  "Valve Steam Deck OLED": "steam-deck-oled.svg",
  "Sony PlayStation 5 Pro": "ps5-pro.svg",
  "ASUS ROG Ally X": "rog-ally-x.svg",
  "Nintendo Switch Lite": "switch-lite.svg",
  "Lenovo Legion Go": "legion-go.svg",
  "Sony PlayStation Portal": "ps-portal.svg",
  "Apple AirPods Pro 2nd Gen": "airpods-pro-2.svg",
  "Sony WH-1000XM5": "sony-wh1000xm5.svg",
  "Samsung Galaxy Buds3 Pro": "galaxy-buds3-pro.svg",
  "Logitech MX Master 3S": "logitech-mx-master-3s.svg",
  "Apple Magic Keyboard Touch ID": "magic-keyboard.svg",
  "Samsung 49-inch Odyssey G9 OLED": "odyssey-g9-oled.svg",
  "Logitech G Pro X Superlight 2": "gpro-superlight-2.svg",
  "Sony WF-1000XM5": "sony-wf1000xm5.svg",
  "Apple AirPods Max USB-C": "airpods-max.svg",
  "Logitech MX Keys S": "mx-keys-s.svg",
  "Elgato Stream Deck MK2": "stream-deck-mk2.svg",
  "Apple Watch Series 10": "apple-watch-s10.svg",
  "Samsung Galaxy Watch 7": "galaxy-watch-7.svg",
  "Garmin Fenix 7X Pro Solar": "garmin-fenix-7x.svg",
  "Apple Watch Ultra 2": "apple-watch-ultra2.svg",
  "Garmin Venu 3": "garmin-venu-3.svg",
  "Samsung Galaxy Watch Ultra": "galaxy-watch-ultra.jpg",
  "Google Pixel Watch 3 XL": "pixel-watch-3.svg",
  "Garmin Instinct 3 Solar": "garmin-instinct-3.svg",
  "Apple Watch SE 2nd Gen": "apple-watch-se2.svg",
  "Samsung Galaxy Watch 6 Classic": "galaxy-watch-6-classic.svg",
};

const CACHED_PRODUCT_IMAGES = {
  "Sony PlayStation 5 Slim": "ps5-slim.jpg",
  "Microsoft Xbox Series X": "xbox-series-x.png",
  "Nintendo Switch OLED": "switch-oled.jpg",
  "Microsoft Xbox Series S": "xbox-series-s.png",
  "Valve Steam Deck OLED": "steam-deck-oled.png",
  "Sony PlayStation 5 Pro": "ps5-pro.jpg",
  "ASUS ROG Ally X": "rog-ally-x.jpg",
  "Nintendo Switch Lite": "switch-lite.jpg",
  "Lenovo Legion Go": "legion-go.webp",
  "Sony PlayStation Portal": "ps-portal.jpg",
  "Apple AirPods Pro 2nd Gen": "airpods-pro-2.jpg",
  "Sony WH-1000XM5": "sony-wh1000xm5.png",
  "Samsung Galaxy Buds3 Pro": "galaxy-buds3-pro.jpg",
  "Logitech MX Master 3S": "logitech-mx-master-3s.jpg",
  "Apple Magic Keyboard Touch ID": "magic-keyboard.jpg",
  "Samsung 49-inch Odyssey G9 OLED": "odyssey-g9-oled.jpg",
  "Logitech G Pro X Superlight 2": "gpro-superlight-2.png",
  "Sony WF-1000XM5": "sony-wf1000xm5.jpg",
  "Apple AirPods Max USB-C": "airpods-max.webp",
  "Logitech MX Keys S": "mx-keys-s.png",
  "Elgato Stream Deck MK2": "stream-deck-mk2.jpg",
  "Apple Watch Series 10": "apple-watch-s10.jpg",
  "Samsung Galaxy Watch 7": "galaxy-watch-7.jpg",
  "Garmin Fenix 7X Pro Solar": "garmin-fenix-7x.jpg",
  "Apple Watch Ultra 2": "apple-watch-ultra2.jpg",
  "Garmin Venu 3": "garmin-venu-3.jpg",
  "Samsung Galaxy Watch Ultra": "galaxy-watch-ultra-real.jpg",
  "Google Pixel Watch 3 XL": "pixel-watch-3.jpg",
  "Garmin Instinct 3 Solar": "garmin-instinct-3.png",
  "Apple Watch SE 2nd Gen": "apple-watch-se2.png",
  "Samsung Galaxy Watch 6 Classic": "galaxy-watch-6-classic.webp",
};

export default function ProductCard({ p }) {
  const localImage = PRODUCT_IMAGES[p.name]
    ? `/products/${PRODUCT_IMAGES[p.name]}`
    : p.images?.[0];
  const image = CACHED_PRODUCT_IMAGES[p.name]
    ? `/product-photos/${CACHED_PRODUCT_IMAGES[p.name]}`
    : localImage;

  return (
    <Link
      to={`/product/${p._id}`}
      className="group block rounded-2xl bg-white border border-slate-100 p-4 transition hover:shadow-xl hover:shadow-violet-100 hover:border-violet-200"
    >
      <div className="aspect-square overflow-hidden rounded-xl bg-slate-50">
        <img
          src={image}
          alt={p.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = localImage || `https://placehold.co/400x400/f1f5f9/94a3b8?text=${encodeURIComponent(p.name)}`;
          }}
          className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-3 line-clamp-1 font-medium text-slate-800">{p.name}</h3>
      <div className="mt-1 flex items-center gap-1 text-sm text-slate-400">
        <Star size={14} className="fill-amber-400 text-amber-400" />
        {p.rating.toFixed(1)} <span>({p.numReviews})</span>
      </div>
      <p className="mt-2 text-lg font-bold text-slate-900">${p.price.toLocaleString()}</p>
    </Link>
  );
}
