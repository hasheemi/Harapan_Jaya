import { NextRequest, NextResponse } from "next/server";
import cephClient from "@/lib/ceph-client";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ file: string[] }> }
) {
  try {
    const { params } = await context; // <-- FIX PENTING
    const fileName = (await params).file.join("/"); // <-- sekarang tidak undefined

    console.log(fileName);

    const fileBuffer = await cephClient.getObject(fileName);

    const extension = fileName.split(".").pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
    };

    const contentType =
      contentTypes[extension ?? ""] ?? "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
        "Content-Disposition": `inline; filename="${fileName}"`,
      },
    });
  } catch (err: any) {
    console.error("CDN error:", err.message);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
