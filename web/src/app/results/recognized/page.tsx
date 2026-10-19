"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { t, type Lang } from "@/lib/i18n";
import { getLang, pushScan } from "@/lib/storage";

function RecognizedContent() {
  const params = useSearchParams();
  const router = useRouter();
  const name = params.get("name") || "";
  const titles = (params.get("titles") || "").split("|").filter(Boolean);
  const [lang, setLang] = useState<Lang>("da");

  useEffect(() => {
    setLang(getLang());
    if (name) pushScan({ name });
  }, [name]);

  return (
    <main className="page">
      <div className="top-bar">
        <button className="icon-btn" onClick={() => router.push("/")} aria-label={t(lang, "back")}>
          ←
        </button>
        <span className="brand" style={{ fontSize: 18, letterSpacing: "0.12em" }}>
          SCANA
        </span>
        <span style={{ width: 40 }} />
      </div>

      <section className="hero-panel">
        <p className="section-label">{t(lang, "recognized")}</p>
        <h2>{name || "Ukendt produkt"}</h2>
        <p>{t(lang, "notInCatalog")}</p>
        <Link
          className="btn"
          href={name ? `/?q=${encodeURIComponent(name)}` : "/"}
        >
          {t(lang, "searchInstead")}
        </Link>
      </section>

      {titles.length > 0 ? (
        <section style={{ marginTop: 28 }}>
          <p className="section-label">Matches</p>
          <div className="result-list">
            {titles.slice(0, 6).map((title) => (
              <Link
                key={title}
                href={`/?q=${encodeURIComponent(title)}`}
                className="result-row"
              >
                <div>
                  <strong>{title}</strong>
                  <span>{t(lang, "searchInstead")}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

export default function RecognizedPage() {
  return (
    <Suspense fallback={<main className="page">…</main>}>
      <RecognizedContent />
    </Suspense>
  );
}
