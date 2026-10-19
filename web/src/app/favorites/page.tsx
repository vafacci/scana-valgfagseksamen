"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CATALOG, type Product } from "@/lib/catalog";
import { t, type Lang } from "@/lib/i18n";
import { favoriteProducts, getLang } from "@/lib/storage";

export default function FavoritesPage() {
  const [lang, setLang] = useState<Lang>("da");
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    setLang(getLang());
    setItems(favoriteProducts(CATALOG));
    const refresh = () => setItems(favoriteProducts(CATALOG));
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  return (
    <main className="page">
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 28,
          fontWeight: 550,
          margin: "0 0 8px",
        }}
      >
        {t(lang, "yourFavorites")}
      </h1>

      {items.length === 0 ? (
        <div className="empty">
          <h2>{t(lang, "noFavorites")}</h2>
          <p>{t(lang, "noFavoritesHint")}</p>
          <Link className="btn" href="/" style={{ marginTop: 16 }}>
            {t(lang, "home")}
          </Link>
        </div>
      ) : (
        <div className="result-list" style={{ marginTop: 20 }}>
          {items.map((product, index) => (
            <Link
              key={product.id}
              href={`/results/${product.id}`}
              className="result-row"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <Image src={product.image} alt="" width={56} height={56} />
              <div>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
