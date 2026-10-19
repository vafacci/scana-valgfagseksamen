import { NextResponse } from "next/server";
import { matchProductFromTitles } from "@/lib/catalog";
import { putMedia } from "@/lib/mediaStore";

type LensMatch = {
  title?: string;
  link?: string;
  source?: string;
};

type LensResponse = {
  visual_matches?: LensMatch[];
  knowledge_graph?: { title?: string };
  search_metadata?: { status?: string };
  error?: string;
};

function originFromRequest(request: Request) {
  const url = new URL(request.url);
  const forwarded = request.headers.get("x-forwarded-host");
  const proto = request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
  if (forwarded) return `${proto}://${forwarded}`;
  return url.origin;
}

function rankTitles(payload: LensResponse) {
  const titles: string[] = [];
  if (payload.knowledge_graph?.title) titles.push(payload.knowledge_graph.title);
  for (const match of payload.visual_matches || []) {
    if (match.title) titles.push(match.title);
  }
  return [...new Set(titles.map((t) => t.trim()).filter(Boolean))];
}

async function callLens(imageUrl: string) {
  const key = process.env.SEARCHAPI_API_KEY;
  if (!key) {
    return { ok: false as const, reason: "missing_api_key" as const };
  }

  const endpoint = new URL("https://www.searchapi.io/api/v1/search");
  endpoint.searchParams.set("engine", "google_lens");
  endpoint.searchParams.set("url", imageUrl);
  endpoint.searchParams.set("api_key", key);
  endpoint.searchParams.set("hl", "da");
  endpoint.searchParams.set("country", "dk");

  const response = await fetch(endpoint.toString(), {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    return { ok: false as const, reason: "lens_failed" as const, status: response.status };
  }

  const data = (await response.json()) as LensResponse;
  return { ok: true as const, data };
}

/** Demo fallback when SearchAPI is unavailable (local/dev without public URL or key). */
function demoMatchFromFilename(name: string) {
  const lower = name.toLowerCase();
  const hints = [
    "airpods",
    "iphone",
    "macbook",
    "ipad",
    "sony",
    "samsung",
    "bose",
    "buds",
  ];
  const hit = hints.find((h) => lower.includes(h));
  return hit ? matchProductFromTitles([hit, name]) : null;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("image");
    const externalUrl = String(form.get("imageUrl") || "");

    let imageUrl = externalUrl;
    let filename = "upload.jpg";

    if (file instanceof File) {
      filename = file.name || filename;
      const bytes = Buffer.from(await file.arrayBuffer());
      if (bytes.byteLength === 0) {
        return NextResponse.json({ error: "empty_image" }, { status: 400 });
      }
      if (bytes.byteLength > 8 * 1024 * 1024) {
        return NextResponse.json({ error: "image_too_large" }, { status: 400 });
      }
      const id = putMedia(bytes, file.type || "image/jpeg");
      imageUrl = `${originFromRequest(request)}/api/media/${id}`;
    }

    if (!imageUrl) {
      return NextResponse.json({ error: "missing_image" }, { status: 400 });
    }

    const lens = await callLens(imageUrl);
    if (lens.ok) {
      const titles = rankTitles(lens.data);
      const product = matchProductFromTitles(titles);
      if (product) {
        return NextResponse.json({
          status: "catalog_match",
          productId: product.id,
          name: product.name,
          titles,
        });
      }
      if (titles[0]) {
        return NextResponse.json({
          status: "recognized",
          name: titles[0],
          titles,
        });
      }
      return NextResponse.json({ status: "no_match", titles: [] }, { status: 404 });
    }

    // Local/dev fallback so UI can be tested without SearchAPI.
    const demoProduct = demoMatchFromFilename(filename);
    if (demoProduct) {
      return NextResponse.json({
        status: "catalog_match",
        productId: demoProduct.id,
        name: demoProduct.name,
        titles: [demoProduct.name],
        demo: true,
        reason: lens.reason,
      });
    }

    return NextResponse.json(
      {
        status: "error",
        error: lens.reason,
        hint:
          lens.reason === "missing_api_key"
            ? "Set SEARCHAPI_API_KEY to enable Google Lens identification."
            : "Lens request failed. Ensure the image URL is publicly reachable.",
      },
      { status: 502 }
    );
  } catch (error) {
    console.error("identify failed", error);
    return NextResponse.json({ error: "identify_failed" }, { status: 500 });
  }
}
