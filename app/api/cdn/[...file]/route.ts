import { NextRequest, NextResponse } from "next/server";
import cephClient from "@/lib/ceph-client";
import { LRUCache } from "lru-cache";

// Inisialisasi LRU Cache
const cdnCache = new LRUCache<string, Buffer>({
  max: 100, // Maksimal 100 file di cache
  maxSize: 50 * 1024 * 1024, // 50MB total size limit
  sizeCalculation: (value, key) => {
    return value.length;
  },
  ttl: 1000 * 60 * 60, // 1 jam TTL
});

export const runtime = "nodejs";
export const dynamic = "force-static"; // Optional: untuk caching yang lebih baik

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ file: string[] }> }
) {
  try {
    const { params } = await context;
    const fileName = (await params).file.join("/");

    console.log("Request file:", fileName);

    // Cek cache terlebih dahulu
    const cachedFile = cdnCache.get(fileName);

    if (cachedFile) {
      console.log("Cache HIT:", fileName);

      const extension = fileName.split(".").pop()?.toLowerCase();
      const contentTypes: Record<string, string> = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
        gif: "image/gif",
        svg: "image/svg+xml",
        ico: "image/x-icon",
      };

      const contentType =
        contentTypes[extension ?? ""] ?? "application/octet-stream";

      return new NextResponse(cachedFile as any, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
          "Content-Disposition": `inline; filename="${fileName}"`,
          "X-Cache-Status": "HIT",
        },
      });
    }

    console.log("Cache MISS:", fileName);

    // Jika tidak ada di cache, ambil dari Ceph
    const fileBuffer = await cephClient.getObject(fileName);

    // Simpan ke cache
    cdnCache.set(fileName, fileBuffer);

    const extension = fileName.split(".").pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
      svg: "image/svg+xml",
      ico: "image/x-icon",
      pdf: "application/pdf",
      txt: "text/plain",
      json: "application/json",
      xml: "application/xml",
    };

    const contentType =
      contentTypes[extension ?? ""] ?? "application/octet-stream";

    return new NextResponse(fileBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": `inline; filename="${fileName}"`,
        "X-Cache-Status": "MISS",
      },
    });
  } catch (err: any) {
    console.error("CDN error:", err.message);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}

// Optional: Export untuk mendapatkan cache stats
// export function getCacheStats() {
//   return {
//     size: cdnCache.size,
//     calculatedSize: cdnCache.calculatedSize,
//     hits: cdnCache.hits,
//     misses: cdnCache.misses,
//   };
// }
