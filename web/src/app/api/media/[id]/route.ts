import { NextResponse } from "next/server";
import { getMedia } from "@/lib/mediaStore";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const media = getMedia(id);
  if (!media) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(media.buffer), {
    headers: {
      "Content-Type": media.contentType,
      "Cache-Control": "private, max-age=300",
    },
  });
}
