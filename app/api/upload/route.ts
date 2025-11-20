import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import cephClient from "@/lib/ceph-client";

export const runtime = "nodejs";

// Daftar ekstensi file yang diizinkan untuk dokumen
const ALLOWED_DOCUMENT_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "xlsx",
  "xls",
  "txt",
];

// Daftar MIME types untuk dokumen
const DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
];

// Fungsi untuk mengecek apakah file adalah dokumen
function isDocumentFile(file: File): boolean {
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  const mimeType = file.type.toLowerCase();

  return (
    ALLOWED_DOCUMENT_EXTENSIONS.includes(fileExtension || "") ||
    DOCUMENT_MIME_TYPES.includes(mimeType)
  );
}

// Fungsi untuk mendapatkan MIME type yang sesuai berdasarkan ekstensi file
function getMimeType(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase();

  const mimeMap: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xls: "application/vnd.ms-excel",
    txt: "text/plain",
    webp: "image/webp",
  };

  return mimeMap[extension || ""] || "application/octet-stream";
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const uploadedFiles: Record<string, string> = {};

    for (const [fieldName, value] of form.entries()) {
      if (value instanceof File) {
        const arrayBuffer = await value.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);

        let fileName: string;
        let finalBuffer: Buffer;
        let mimeType: string;

        if (isDocumentFile(value)) {
          // Untuk dokumen, gunakan file asli tanpa optimasi
          const originalExtension = value.name.split(".").pop()?.toLowerCase();
          fileName = `${fieldName}-${timestamp}-${randomString}.${originalExtension}`;
          finalBuffer = buffer;
          mimeType = getMimeType(value.name);
        } else {
          // Untuk gambar, optimasi dengan Sharp
          const optimizedBuffer = await sharp(buffer)
            .webp({ quality: 20 })
            .toBuffer();

          fileName = `${fieldName}-${timestamp}-${randomString}.webp`;
          finalBuffer = optimizedBuffer;
          mimeType = "image/webp";
        }

        await cephClient.uploadObject(fileName, finalBuffer, mimeType);
        uploadedFiles[fieldName] = `/api/cdn/${fileName}`;
      }
    }

    return NextResponse.json({
      success: true,
      result: uploadedFiles,
    });
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
