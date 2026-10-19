export type Offer = {
  store: string;
  price: number;
  shipping: string;
  eta: string;
  rating: number;
  url?: string;
};

export type Product = {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
  image: string;
  searchTerms: string[];
  confidence: number;
  offers: Offer[];
};

export type OfferFilter = "billigste" | "hurtigste" | "anbefalet";

const STORE_SEARCH: Record<string, (q: string) => string> = {
  Elgiganten: (q) => `https://www.elgiganten.dk/search?q=${q}`,
  Proshop: (q) => `https://www.proshop.dk/Search?s=${q}`,
  Power: (q) => `https://www.power.dk/search?q=${q}`,
  Apple: (q) => `https://www.apple.com/dk/search/${q}?src=globalnav`,
  Bilka: (q) => `https://www.bilka.dk/search?text=${q}`,
  Coolshop: (q) => `https://www.coolshop.dk/soeg/?q=${q}`,
  Samsung: (q) => `https://www.samsung.com/dk/search/?searchvalue=${q}`,
  Sony: (q) => `https://www.sony.dk/electronics/search?query=${q}`,
};

export function etaMinDays(eta: string | undefined) {
  const match = String(eta ?? "").match(/\d+/);
  return match ? parseInt(match[0], 10) : 99;
}

export function formatPrice(amount: number | string) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return String(amount ?? "");
  return `${Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} kr`;
}

export function getLowestPrice(offers: Offer[] | undefined) {
  if (!offers?.length) return null;
  return Math.min(...offers.map((offer) => offer.price));
}

function recommendedScore(offer: Offer, offers: Offer[]) {
  const minPrice = getLowestPrice(offers) ?? offer.price;
  const maxPrice = Math.max(...offers.map((item) => item.price));
  const minEta = Math.min(...offers.map((item) => etaMinDays(item.eta)));
  const maxEta = Math.max(...offers.map((item) => etaMinDays(item.eta)));
  const priceSpread = Math.max(maxPrice - minPrice, 1);
  const etaSpread = Math.max(maxEta - minEta, 1);
  const priceScore = 1 - (offer.price - minPrice) / priceSpread;
  const etaScore = 1 - (etaMinDays(offer.eta) - minEta) / etaSpread;
  const ratingScore = (Number(offer.rating) || 0) / 5;
  return ratingScore * 0.4 + priceScore * 0.4 + etaScore * 0.2;
}

export function sortOffers(offers: Offer[] | undefined, filter: OfferFilter) {
  const list = [...(offers || [])];
  if (list.length === 0) return list;

  if (filter === "hurtigste") {
    return list.sort((a, b) => {
      const etaDiff = etaMinDays(a.eta) - etaMinDays(b.eta);
      if (etaDiff !== 0) return etaDiff;
      return a.price - b.price;
    });
  }

  if (filter === "anbefalet") {
    const scores = new Map(list.map((offer) => [offer, recommendedScore(offer, list)]));
    return list.sort((a, b) => (scores.get(b) ?? 0) - (scores.get(a) ?? 0));
  }

  return list.sort((a, b) => a.price - b.price);
}

export const CATALOG: Product[] = [
  {
    id: "airpods",
    name: "Apple AirPods Pro (2nd Gen)",
    price: "1.649 kr",
    category: "Elektronik",
    description: "Aktiv støjreduktion med Adaptive Transparency",
    image: "/products/airpods-pro.jpeg",
    searchTerms: ["airpods", "apple", "øretelefoner", "høretelefoner", "buds"],
    confidence: 0.95,
    offers: [
      { store: "Proshop", price: 1649, shipping: "29 kr", eta: "2-4", rating: 4.4 },
      { store: "Elgiganten", price: 1699, shipping: "39 kr", eta: "1-2", rating: 4.3 },
      { store: "Power", price: 1729, shipping: "Gratis", eta: "1-3", rating: 4.2 },
      { store: "Bilka", price: 1799, shipping: "49 kr", eta: "2-5", rating: 4.1 },
      { store: "Apple", price: 1899, shipping: "Gratis", eta: "1-2", rating: 4.8 },
    ],
  },
  {
    id: "samsung_buds",
    name: "Samsung Galaxy Buds Pro",
    price: "1.199 kr",
    category: "Elektronik",
    description: "Aktiv støjreduktion og ambient sound",
    image: "/products/samsung-buds.jpg",
    searchTerms: ["samsung", "galaxy", "buds", "øretelefoner"],
    confidence: 0.92,
    offers: [
      { store: "Proshop", price: 1199, shipping: "29 kr", eta: "2-4", rating: 4.3 },
      { store: "Elgiganten", price: 1249, shipping: "39 kr", eta: "1-2", rating: 4.2 },
      { store: "Power", price: 1299, shipping: "Gratis", eta: "1-3", rating: 4.1 },
      { store: "Samsung", price: 1399, shipping: "Gratis", eta: "2-4", rating: 4.5 },
    ],
  },
  {
    id: "sony_headphones",
    name: "Sony WH-1000XM5",
    price: "2.499 kr",
    category: "Elektronik",
    description: "Brancheledende støjreduktion med V1-processor",
    image: "/products/sony-wh.webp",
    searchTerms: ["sony", "wh-1000", "høretelefoner", "noise cancelling"],
    confidence: 0.88,
    offers: [
      { store: "Proshop", price: 2499, shipping: "29 kr", eta: "2-4", rating: 4.6 },
      { store: "Elgiganten", price: 2699, shipping: "39 kr", eta: "1-2", rating: 4.4 },
      { store: "Power", price: 2749, shipping: "Gratis", eta: "1-3", rating: 4.3 },
      { store: "Sony", price: 2799, shipping: "Gratis", eta: "2-5", rating: 4.7 },
    ],
  },
  {
    id: "iphone",
    name: "iPhone 15 Pro",
    price: "8.999 kr",
    category: "Elektronik",
    description: "Titanium-design med A17 Pro-chip",
    image: "/products/iphone-15.webp",
    searchTerms: ["iphone", "apple", "15 pro", "telefon"],
    confidence: 0.97,
    offers: [
      { store: "Proshop", price: 8999, shipping: "Gratis", eta: "2-4", rating: 4.5 },
      { store: "Elgiganten", price: 9299, shipping: "Gratis", eta: "1-2", rating: 4.4 },
      { store: "Power", price: 9499, shipping: "Gratis", eta: "1-3", rating: 4.3 },
      { store: "Apple", price: 9999, shipping: "Gratis", eta: "1-2", rating: 4.8 },
    ],
  },
  {
    id: "macbook",
    name: 'MacBook Pro 16"',
    price: "18.499 kr",
    category: "Elektronik",
    description: "M3 Pro-chip med høj ydeevne",
    image: "/products/macbook.jpeg",
    searchTerms: ["macbook", "apple", "laptop", "computer"],
    confidence: 0.94,
    offers: [
      { store: "Proshop", price: 18499, shipping: "Gratis", eta: "3-6", rating: 4.6 },
      { store: "Elgiganten", price: 18999, shipping: "Gratis", eta: "2-4", rating: 4.4 },
      { store: "Power", price: 19299, shipping: "Gratis", eta: "2-5", rating: 4.3 },
      { store: "Apple", price: 19999, shipping: "Gratis", eta: "1-3", rating: 4.8 },
    ],
  },
  {
    id: "ipad",
    name: 'iPad Pro 12.9"',
    price: "11.499 kr",
    category: "Elektronik",
    description: "M2-chip med Liquid Retina XDR-skærm",
    image: "/products/ipad-pro.webp",
    searchTerms: ["ipad", "apple", "tablet"],
    confidence: 0.91,
    offers: [
      { store: "Proshop", price: 11499, shipping: "Gratis", eta: "2-4", rating: 4.5 },
      { store: "Elgiganten", price: 11999, shipping: "Gratis", eta: "1-3", rating: 4.3 },
      { store: "Power", price: 12199, shipping: "Gratis", eta: "2-4", rating: 4.2 },
      { store: "Apple", price: 12499, shipping: "Gratis", eta: "1-2", rating: 4.7 },
    ],
  },
  {
    id: "bose",
    name: "Bose QuietComfort",
    price: "2.799 kr",
    category: "Elektronik",
    description: "Behagelige over-ear høretelefoner med stærk ANC",
    image: "/products/bose.jpg",
    searchTerms: ["bose", "quietcomfort", "høretelefoner"],
    confidence: 0.9,
    offers: [
      { store: "Coolshop", price: 2799, shipping: "29 kr", eta: "2-4", rating: 4.5 },
      { store: "Elgiganten", price: 2999, shipping: "39 kr", eta: "1-2", rating: 4.3 },
      { store: "Power", price: 3099, shipping: "Gratis", eta: "1-3", rating: 4.2 },
      { store: "Proshop", price: 3199, shipping: "29 kr", eta: "2-5", rating: 4.4 },
    ],
  },
];

export function searchCatalog(query: string) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return CATALOG.filter((product) => {
    const haystack = `${product.name} ${product.category} ${product.searchTerms.join(" ")}`.toLowerCase();
    return haystack.includes(q) || product.searchTerms.some((term) => q.includes(term));
  });
}

export function findProductByName(name: string | undefined | null) {
  if (!name) return null;
  const lower = String(name).trim().toLowerCase();
  return (
    CATALOG.find((product) => product.name.toLowerCase() === lower) ||
    CATALOG.find((product) => product.name.toLowerCase().includes(lower)) ||
    null
  );
}

export function findProductById(id: string | undefined | null) {
  if (!id) return null;
  return CATALOG.find((product) => product.id === id) || null;
}

export function matchProductFromTitles(titles: string[]) {
  const scored = CATALOG.map((product) => {
    const name = product.name.toLowerCase();
    const terms = product.searchTerms.map((t) => t.toLowerCase());
    let score = 0;
    for (const title of titles) {
      const t = title.toLowerCase();
      if (!t) continue;
      if (t.includes(name) || name.includes(t)) score += 5;
      for (const term of terms) {
        if (term.length >= 3 && t.includes(term)) score += 2;
      }
      const nameParts = name.split(/[^a-z0-9æøå]+/i).filter((p) => p.length > 2);
      for (const part of nameParts) {
        if (t.includes(part)) score += 1;
      }
    }
    return { product, score };
  })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored[0]?.product ?? null;
}

export const PRICES_UPDATED = "30. sep. 2026";

export function storeSearchUrl(store: string, productName: string) {
  const q = encodeURIComponent(productName);
  const builder = STORE_SEARCH[store];
  return builder ? builder(q) : `https://www.google.com/search?q=${q}+${encodeURIComponent(store)}`;
}

export function offerUrl(offer: Offer, productName: string) {
  if (offer?.url) return offer.url;
  return storeSearchUrl(offer?.store, productName);
}
