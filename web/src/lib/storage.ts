"use client";

import type { Product } from "./catalog";

const FAVORITES_KEY = "@scana_favorites_v1";
const SCANS_KEY = "@scana_scans_v1";
const LANG_KEY = "@scana_lang_v1";

export type ScanEntry = {
  productId?: string;
  name: string;
  image?: string;
  at: string;
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getFavoriteIds(): string[] {
  return readJson<string[]>(FAVORITES_KEY, []);
}

export function isFavorite(id: string) {
  return getFavoriteIds().includes(id);
}

export function toggleFavorite(id: string) {
  const current = getFavoriteIds();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [id, ...current];
  writeJson(FAVORITES_KEY, next);
  return next;
}

export function getScans(): ScanEntry[] {
  return readJson<ScanEntry[]>(SCANS_KEY, []);
}

export function pushScan(entry: Omit<ScanEntry, "at"> & { at?: string }) {
  const next = [{ ...entry, at: entry.at ?? new Date().toISOString() }, ...getScans()].slice(0, 20);
  writeJson(SCANS_KEY, next);
  return next;
}

export function getLang(): "da" | "en" {
  const value = readJson<"da" | "en" | null>(LANG_KEY, null);
  return value === "en" ? "en" : "da";
}

export function setLang(lang: "da" | "en") {
  writeJson(LANG_KEY, lang);
}

export function favoriteProducts(catalog: Product[]) {
  const ids = new Set(getFavoriteIds());
  return catalog.filter((p) => ids.has(p.id));
}
