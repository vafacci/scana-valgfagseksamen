"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  findProductById,
  formatPrice,
  getLowestPrice,
  offerUrl,
  sortOffers,
  type OfferFilter,
} from "@/lib/catalog";
import { t, type Lang } from "@/lib/i18n";
import { getLang, isFavorite, pushScan, toggleFavorite } from "@/lib/storage";

const FILTERS: OfferFilter[] = ["billigste", "hurtigste", "anbefalet"];

export default function ResultsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const product = findProductById(params.id);
  const [lang, setLang] = useState<Lang>("da");
  const [filter, setFilter] = useState<OfferFilter>("billigste");
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setLang(getLang());
    if (product) {
      setFav(isFavorite(product.id));
      pushScan({ productId: product.id, name: product.name, image: product.image });
    }
  }, [product]);

  const offers = useMemo(
    () => (product ? sortOffers(product.offers, filter) : []),
    [product, filter]
  );
  const lowest = product ? getLowestPrice(product.offers) : null;

  if (!product) {
    return (
      <main className="page">
        <div className="empty">
          <h2>Produkt ikke fundet</h2>
          <Link className="btn" href="/">
            {t(lang, "home")}
          </Link>
        </div>
      </main>
    );
  }

  const filterLabel = (f: OfferFilter) => {
    if (f === "billigste") return t(lang, "filterCheapest");
    if (f === "hurtigste") return t(lang, "filterFastest");
    return t(lang, "filterRecommended");
  };

  return (
    <main className="page">
      <div className="top-bar">
        <button className="icon-btn" onClick={() => router.back()} aria-label={t(lang, "back")}>
          ←
        </button>
        <span className="brand" style={{ fontSize: 18, letterSpacing: "0.12em" }}>
          SCANA
        </span>
        <button
          className="icon-btn"
          aria-label={fav ? t(lang, "removeFavorite") : t(lang, "addFavorite")}
          onClick={() => setFav(toggleFavorite(product.id).includes(product.id))}
        >
          {fav ? "♥" : "♡"}
        </button>
      </div>

      <div style={{ textAlign: "center" }}>
        <Image
          src={product.image}
          alt={product.name}
          width={220}
          height={220}
          style={{
            margin: "0 auto",
            objectFit: "contain",
            borderRadius: 28,
            background: "#faf9f7",
          }}
        />
        <p className="eyebrow" style={{ marginTop: 16 }}>
          {product.category}
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 550,
            margin: "6px 0 8px",
            lineHeight: 1.2,
          }}
        >
          {product.name}
        </h1>
        <p className="eyebrow">{product.description}</p>
      </div>

      <div className="chips" role="tablist" aria-label="Sort">
        {FILTERS.map((item) => (
          <button
            key={item}
            className="chip"
            data-active={filter === item}
            onClick={() => setFilter(item)}
          >
            {filterLabel(item)}
          </button>
        ))}
      </div>

      <div className="offer-list">
        {offers.map((offer, index) => {
          const best = lowest != null && offer.price === lowest && filter === "billigste";
          return (
            <a
              key={`${offer.store}-${offer.price}`}
              className="offer-row"
              data-best={best}
              href={offerUrl(offer, product.name)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ animationDelay: `${index * 45}ms` }}
            >
              <div>
                <div className="offer-store">{offer.store}</div>
                <div className="offer-meta">
                  {t(lang, "shipping")} {offer.shipping} · {offer.eta} {t(lang, "days")}
                </div>
                {best ? <span className="badge">{t(lang, "cheapest")}</span> : null}
              </div>
              <div>
                <div className="offer-price">{formatPrice(offer.price)}</div>
                <div className="offer-meta" style={{ textAlign: "right" }}>
                  ★ {offer.rating.toFixed(1)}
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {offers[0] ? (
        <a
          className="btn"
          style={{ width: "100%", marginTop: 20 }}
          href={offerUrl(offers[0], product.name)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t(lang, "openStore")} · {offers[0].store}
        </a>
      ) : null}
    </main>
  );
}
