"use client";

import { useEffect, useState } from "react";
import { PRICES_UPDATED } from "@/lib/catalog";
import { t, type Lang } from "@/lib/i18n";
import { getLang, setLang as persistLang } from "@/lib/storage";

export default function SettingsPage() {
  const [lang, setLang] = useState<Lang>("da");

  useEffect(() => {
    setLang(getLang());
  }, []);

  const changeLang = (next: Lang) => {
    persistLang(next);
    setLang(next);
    window.dispatchEvent(new Event("scana-lang"));
  };

  return (
    <main className="page">
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 28,
          fontWeight: 550,
          margin: "0 0 20px",
        }}
      >
        {t(lang, "settings")}
      </h1>

      <div className="settings-list">
        <div className="settings-row">
          <div>
            <strong>{t(lang, "language")}</strong>
            <span>Dansk / English</span>
          </div>
          <div className="lang-pills">
            <button data-active={lang === "da"} onClick={() => changeLang("da")}>
              DA
            </button>
            <button data-active={lang === "en"} onClick={() => changeLang("en")}>
              EN
            </button>
          </div>
        </div>

        <div className="settings-row">
          <div>
            <strong>{t(lang, "aboutPrices")}</strong>
            <span>
              {t(lang, "aboutPricesBody")} {t(lang, "pricesChecked")} {PRICES_UPDATED}.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
