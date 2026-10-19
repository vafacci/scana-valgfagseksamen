"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { t, type Lang } from "@/lib/i18n";
import { getLang } from "@/lib/storage";

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [lang, setLang] = useState<Lang>("da");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    setLang(getLang());
    let stream: MediaStream | null = null;
    let cancelled = false;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
        }
      } catch {
        setError(t(getLang(), "cameraDenied"));
      }
    }

    startCamera();
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function identifyBlob(blob: Blob, filename = "scan.jpg") {
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("image", blob, filename);
      const response = await fetch("/api/identify", { method: "POST", body });
      const data = await response.json();

      if (data.status === "catalog_match" && data.productId) {
        router.push(`/results/${data.productId}`);
        return;
      }
      if (data.status === "recognized" && data.name) {
        const titles = encodeURIComponent((data.titles || []).slice(0, 8).join("|"));
        router.push(
          `/results/recognized?name=${encodeURIComponent(data.name)}&titles=${titles}`
        );
        return;
      }
      setError(t(lang, "identifyFailed"));
    } catch {
      setError(t(lang, "identifyFailed"));
    } finally {
      setBusy(false);
    }
  }

  async function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !ready) {
      fileRef.current?.click();
      return;
    }
    canvas.width = video.videoWidth || 1080;
    canvas.height = video.videoHeight || 1440;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.9)
    );
    if (!blob) return;
    setPreview(URL.createObjectURL(blob));
    await identifyBlob(blob, "capture.jpg");
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    await identifyBlob(file, file.name || "upload.jpg");
  }

  return (
    <main className="page">
      <div className="top-bar">
        <Link className="icon-btn" href="/" aria-label={t(lang, "back")}>
          ✕
        </Link>
        <span className="brand" style={{ fontSize: 18, letterSpacing: "0.12em" }}>
          SCANA
        </span>
        <span style={{ width: 40 }} />
      </div>

      <p className="eyebrow" style={{ textAlign: "center", marginBottom: 14 }}>
        {busy ? t(lang, "identifying") : t(lang, "pointCamera")}
      </p>

      <div className="scan-stage">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" />
        ) : (
          <video ref={videoRef} playsInline muted />
        )}
        <div className="scan-frame" />
      </div>
      <canvas ref={canvasRef} hidden />

      {error ? <div className="status-banner error-banner">{error}</div> : null}
      {busy ? <div className="status-banner">{t(lang, "identifying")}</div> : null}

      <div className="scan-actions">
        <button
          className="shutter"
          aria-label={t(lang, "capture")}
          onClick={capture}
          disabled={busy}
        />
        <button className="linkish" onClick={() => fileRef.current?.click()} disabled={busy}>
          {t(lang, "uploadImage")}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </div>
    </main>
  );
}
