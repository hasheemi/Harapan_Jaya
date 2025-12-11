import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import cephClient from "@/lib/ceph-client";
import DOMPurify from "isomorphic-dompurify";

export const runtime = "nodejs";

// Daftar ekstensi file yang diizinkan untuk dokumen
const ALLOWED_DOCUMENT_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "xlsx",
  "xls",
  "txt",
  "html",
  "htm",
];

// Daftar MIME types untuk dokumen
const DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/html",
  "text/htm",
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
    html: "text/html",
    htm: "text/html",
    webp: "image/webp",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
  };

  return mimeMap[extension || ""] || "application/octet-stream";
}

// Fungsi untuk sanitize HTML - menghapus script/iframe tapi pertahankan formatting
function sanitizeHtmlManual(html: string): string {
  if (!html || typeof html !== "string") return "";

  // Hapus script, iframe, dan tag berbahaya
  let safeHtml = html
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove iframe tags and content
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    // Remove other dangerous tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/<frame\b[^<]*(?:(?!<\/frame>)<[^<]*)*<\/frame>/gi, "")
    // Remove event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/on\w+\s*=\s*[^"'\s>]*/gi, "")
    // Remove javascript: protocol
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    // Remove style tags and content
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    // Remove meta refresh
    .replace(/<meta[^>]*http-equiv\s*=\s*["']?refresh["']?[^>]*>/gi, "");

  // Tetap pertahankan formatting tags
  const allowedTags = [
    "p",
    "br",
    "b",
    "strong",
    "i",
    "em",
    "u",
    "ins",
    "s",
    "strike",
    "del",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "blockquote",
    "q",
    "code",
    "pre",
    "div",
    "span",
    "hr",
    "a",
  ];

  // Hanya allow attributes yang aman untuk tag a
  safeHtml = safeHtml.replace(/<a\s+([^>]*)>/gi, (match, attributes) => {
    // Extract only href, title, target, rel
    const hrefMatch = attributes.match(/href\s*=\s*["']([^"']*)["']/i);
    const titleMatch = attributes.match(/title\s*=\s*["']([^"']*)["']/i);
    const targetMatch = attributes.match(/target\s*=\s*["']([^"']*)["']/i);
    const relMatch = attributes.match(/rel\s*=\s*["']([^"']*)["']/i);

    const safeAttrs = [];
    if (
      hrefMatch &&
      hrefMatch[1] &&
      !hrefMatch[1].toLowerCase().startsWith("javascript:")
    ) {
      safeAttrs.push(`href="${hrefMatch[1]}"`);
    }
    if (titleMatch) safeAttrs.push(`title="${titleMatch[1]}"`);
    if (targetMatch) safeAttrs.push(`target="${targetMatch[1]}"`);
    if (relMatch) {
      safeAttrs.push(`rel="${relMatch[1]}"`);
    } else if (targetMatch && targetMatch[1] === "_blank") {
      safeAttrs.push('rel="noopener noreferrer"');
    }

    return `<a ${safeAttrs.join(" ")}>`;
  });

  return safeHtml;
}

export async function POST(req: NextRequest) {
  console.log("API Upload: Processing request...");

  try {
    const form = await req.formData();
    const uploadedFiles: Record<string, string> = {};
    const uploadedFileNames: string[] = [];
    const campaignId =
      (form.get("campaignId") as string) || Date.now().toString();

    console.log("Campaign ID:", campaignId);

    let posterFile: File | null = null;
    let descriptionText: string | null = null;

    // Collect files and description
    for (const [fieldName, value] of form.entries()) {
      console.log(`Processing field: ${fieldName}`);

      if (fieldName === "file" && value instanceof File) {
        posterFile = value;
      } else if (fieldName === "description" && typeof value === "string") {
        descriptionText = value;
      }
    }

    // Process image file
    if (posterFile) {
      console.log(
        `Processing poster file: ${posterFile.name}, type: ${posterFile.type}, size: ${posterFile.size} bytes`
      );

      const arrayBuffer = await posterFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);

      let fileName: string;
      let finalBuffer: Buffer;
      let mimeType: string;

      if (isDocumentFile(posterFile)) {
        // Untuk dokumen, gunakan file asli tanpa optimasi
        const originalExtension = posterFile.name
          .split(".")
          .pop()
          ?.toLowerCase();
        fileName = `${campaignId}-poster-${timestamp}-${randomString}.${originalExtension}`;
        finalBuffer = buffer;
        mimeType = getMimeType(posterFile.name);
      } else {
        // Untuk gambar, optimasi dengan Sharp
        console.log(`Optimizing image: ${posterFile.name}`);
        // const optimizedBuffer = await sharp(buffer)
        //   .resize(1200, 800, { fit: "inside", withoutEnlargement: true })
        //   .webp({ quality: 80 }) // Quality 80 untuk balance quality/size
        //   .toBuffer();
        const optimizedBuffer = await sharp(buffer)
          .resize(1400, null, { withoutEnlargement: true })
          .webp({
            quality: 90,
            nearLossless: true,
            effort: 4,
          })
          .toBuffer();

        fileName = `${campaignId}-poster-${timestamp}-${randomString}.webp`;
        finalBuffer = optimizedBuffer;
        mimeType = "image/webp";
      }

      console.log(`Uploading to Ceph: ${fileName}`);
      await cephClient.uploadObject(fileName, finalBuffer, mimeType);
      uploadedFiles["poster"] = `/api/cdn/${fileName}`;
      uploadedFileNames.push(fileName);

      console.log(`Uploaded poster: ${fileName}`);
    }

    // Process description text
    if (descriptionText) {
      console.log("Processing description text...");
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);

      // Sanitize HTML - hapus script/iframe tapi pertahankan formatting
      const safeHtml = sanitizeHtmlManual(descriptionText);

      // Simpan sebagai .txt file (berisi HTML yang aman)
      const txtFileName = `${campaignId}-description-${timestamp}-${randomString}.txt`;
      const txtBuffer = Buffer.from(safeHtml, "utf-8");

      console.log(
        `Creating description file: ${txtFileName}, size: ${txtBuffer.length} bytes`
      );
      await cephClient.uploadObject(txtFileName, txtBuffer, "text/plain");
      uploadedFiles["description"] = `/api/cdn/${txtFileName}`;
      uploadedFileNames.push(txtFileName);

      console.log(`Description saved as: ${txtFileName}`);

      // Log contoh HTML sebelum dan sesudah sanitize
      console.log("\n=== HTML SANITIZATION EXAMPLE ===");
      console.log("Original length:", descriptionText.length, "chars");
      console.log("Sanitized length:", safeHtml.length, "chars");

      // Contoh kecil untuk debug
      if (descriptionText.length < 500) {
        console.log(
          "Original snippet:",
          descriptionText.substring(0, 200) + "..."
        );
        console.log("Sanitized snippet:", safeHtml.substring(0, 200) + "...");
      }
    }

    if (!posterFile && !descriptionText) {
      return NextResponse.json(
        {
          success: false,
          message: "No file or description provided",
        },
        { status: 400 }
      );
    }

    console.log("Upload completed successfully");
    console.log("Uploaded files:", uploadedFiles);

    return NextResponse.json({
      success: true,
      message: "Files uploaded successfully",
      result: uploadedFiles,
      filenames: uploadedFileNames,
      campaignId: campaignId,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    console.error("Error stack:", err.stack);

    return NextResponse.json(
      {
        success: false,
        error: err.message,
        message: "Failed to upload files",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Upload API is running",
    endpoints: {
      POST: "Upload poster image and description",
      parameters: {
        file: "Image file (optimized to WebP, field name must be 'file')",
        description: "HTML text (sanitized and saved as .txt file)",
        campaignId: "Optional campaign identifier",
      },
      returns: {
        "result.poster": "URL to uploaded image",
        "result.description": "URL to sanitized HTML .txt file",
      },
    },
  });
}
