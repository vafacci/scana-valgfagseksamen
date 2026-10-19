"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { CATALOG, findProductById, PRICES_UPDATED, searchCatalog } from "@/lib/catalog";
import { t, type Lang } from "@/lib/i18n";
import { getLang, getScans, type ScanEntry } from "@/lib/storage";

function HomeContent() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Lang>("da");
  const [query, setQuery] = useState("");
  const [latest, setLatest] = useState<ScanEntry | null>(null);

  useEffect(() => {
    setLang(getLang());
    const scans = getScans();
    setLatest(scans[0] ?? null);
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  const results = useMemo(() => searchCatalog(query), [query]);
  const searching = query.trim().length >= 2;
  const latestProduct = latest?.productId ? findProductById(latest.productId) : null;

  return (
    <main className="page">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h1 className="brand">SCANA</h1>
        <span className="badge" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
          {t(lang, "beta")}
        </span>
      </div>
      <p className="eyebrow">{t(lang, "homeHint")}</p>

      <label className="search-box">
        <SearchIcon />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t(lang, "searchPlaceholder")}
          enterKeyHint="search"
        />
      </label>

      {searching ? (
        <section style={{ marginTop: 24 }}>
          <p className="section-label">{t(lang, "results")}</p>
          {results.length === 0 ? (
            <p className="eyebrow">{t(lang, "noSearchResults")}</p>
          ) : (
            <div className="result-list">
              {results.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/results/${product.id}`}
                  className="result-row"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <Image src={product.image} alt="" width={56} height={56} />
                  <div>
                    <strong>{product.name}</strong>
                    <span>
                      {product.category} · {product.price}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="hero-panel">
          {latestProduct ? (
            <>
              <Image
                className="product-thumb"
                src={latestProduct.image}
                alt={latestProduct.name}
                width={120}
                height={120}
              />
              <h2>{latestProduct.name}</h2>
              <p>{latestProduct.description}</p>
              <Link className="btn" href={`/results/${latestProduct.id}`}>
                {t(lang, "results")}
              </Link>
            </>
          ) : (
            <>
              <CameraMark />
              <h2>{t(lang, "lastScan")}</h2>
              <p>{t(lang, "scanToSeeLatest")}</p>
              <Link className="btn" href="/scan">
                {t(lang, "scanNow")}
              </Link>
            </>
          )}
        </section>
      )}

      {!searching && (
        <section style={{ marginTop: 28 }}>
          <p className="section-label">Katalog</p>
          <div className="result-list">
            {CATALOG.slice(0, 4).map((product, index) => (
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
        </section>
      )}

      <p className="disclaimer">
        {t(lang, "priceDisclaimer")} {t(lang, "pricesChecked")} {PRICES_UPDATED}.
      </p>
    </main>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CameraMark() {
  return (
    <div
      style={{
        width: 64,
        height: 64,
        margin: "0 auto",
        borderRadius: 20,
        background: "var(--accent-soft)",
        color: "var(--accent)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
        <circle cx="12" cy="13" r="3.5" />
      </svg>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<main className="page">…</main>}>
      <HomeContent />
    </Suspense>
  );
}
