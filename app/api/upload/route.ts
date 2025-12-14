// import { NextRequest, NextResponse } from "next/server";
// import sharp from "sharp";
// import cephClient from "@/lib/ceph-client";
// import DOMPurify from "isomorphic-dompurify";

// export const runtime = "nodejs";

// // Daftar ekstensi file yang diizinkan untuk dokumen
// const ALLOWED_DOCUMENT_EXTENSIONS = [
//   "pdf",
//   "doc",
//   "docx",
//   "xlsx",
//   "xls",
//   "txt",
//   "html",
//   "htm",
// ];

// // Daftar MIME types untuk dokumen
// const DOCUMENT_MIME_TYPES = [
//   "application/pdf",
//   "application/msword",
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   "application/vnd.ms-excel",
//   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   "text/plain",
//   "text/html",
//   "text/htm",
// ];

// // Fungsi untuk mengecek apakah file adalah dokumen
// function isDocumentFile(file: File): boolean {
//   const fileExtension = file.name.split(".").pop()?.toLowerCase();
//   const mimeType = file.type.toLowerCase();

//   return (
//     ALLOWED_DOCUMENT_EXTENSIONS.includes(fileExtension || "") ||
//     DOCUMENT_MIME_TYPES.includes(mimeType)
//   );
// }

// // Fungsi untuk mendapatkan MIME type yang sesuai berdasarkan ekstensi file
// function getMimeType(fileName: string): string {
//   const extension = fileName.split(".").pop()?.toLowerCase();

//   const mimeMap: Record<string, string> = {
//     pdf: "application/pdf",
//     doc: "application/msword",
//     docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     xls: "application/vnd.ms-excel",
//     txt: "text/plain",
//     html: "text/html",
//     htm: "text/html",
//     webp: "image/webp",
//     jpg: "image/jpeg",
//     jpeg: "image/jpeg",
//     png: "image/png",
//     gif: "image/gif",
//   };

//   return mimeMap[extension || ""] || "application/octet-stream";
// }

// // Fungsi untuk sanitize HTML - menghapus script/iframe tapi pertahankan formatting
// function sanitizeHtmlManual(html: string): string {
//   if (!html || typeof html !== "string") return "";

//   // Hapus script, iframe, dan tag berbahaya
//   let safeHtml = html
//     // Remove script tags and content
//     .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
//     // Remove iframe tags and content
//     .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
//     // Remove other dangerous tags
//     .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
//     .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
//     .replace(/<frame\b[^<]*(?:(?!<\/frame>)<[^<]*)*<\/frame>/gi, "")
//     // Remove event handlers
//     .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
//     .replace(/on\w+\s*=\s*[^"'\s>]*/gi, "")
//     // Remove javascript: protocol
//     .replace(/javascript:/gi, "")
//     .replace(/data:/gi, "")
//     // Remove style tags and content
//     .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
//     // Remove meta refresh
//     .replace(/<meta[^>]*http-equiv\s*=\s*["']?refresh["']?[^>]*>/gi, "");

//   // Tetap pertahankan formatting tags
//   const allowedTags = [
//     "p",
//     "br",
//     "b",
//     "strong",
//     "i",
//     "em",
//     "u",
//     "ins",
//     "s",
//     "strike",
//     "del",
//     "h1",
//     "h2",
//     "h3",
//     "h4",
//     "h5",
//     "h6",
//     "ul",
//     "ol",
//     "li",
//     "blockquote",
//     "q",
//     "code",
//     "pre",
//     "div",
//     "span",
//     "hr",
//     "a",
//   ];

//   // Hanya allow attributes yang aman untuk tag a
//   safeHtml = safeHtml.replace(/<a\s+([^>]*)>/gi, (match, attributes) => {
//     // Extract only href, title, target, rel
//     const hrefMatch = attributes.match(/href\s*=\s*["']([^"']*)["']/i);
//     const titleMatch = attributes.match(/title\s*=\s*["']([^"']*)["']/i);
//     const targetMatch = attributes.match(/target\s*=\s*["']([^"']*)["']/i);
//     const relMatch = attributes.match(/rel\s*=\s*["']([^"']*)["']/i);

//     const safeAttrs = [];
//     if (
//       hrefMatch &&
//       hrefMatch[1] &&
//       !hrefMatch[1].toLowerCase().startsWith("javascript:")
//     ) {
//       safeAttrs.push(`href="${hrefMatch[1]}"`);
//     }
//     if (titleMatch) safeAttrs.push(`title="${titleMatch[1]}"`);
//     if (targetMatch) safeAttrs.push(`target="${targetMatch[1]}"`);
//     if (relMatch) {
//       safeAttrs.push(`rel="${relMatch[1]}"`);
//     } else if (targetMatch && targetMatch[1] === "_blank") {
//       safeAttrs.push('rel="noopener noreferrer"');
//     }

//     return `<a ${safeAttrs.join(" ")}>`;
//   });

//   return safeHtml;
// }

// export async function POST(req: NextRequest) {
//   console.log("API Upload: Processing request...");

//   try {
//     const form = await req.formData();
//     const uploadedFiles: Record<string, string> = {};
//     const uploadedFileNames: string[] = [];
//     const campaignId =
//       (form.get("campaignId") as string) || Date.now().toString();

//     console.log("Campaign ID:", campaignId);

//     let posterFile: File | null = null;
//     let descriptionText: string | null = null;

//     // Collect files and description
//     for (const [fieldName, value] of form.entries()) {
//       console.log(`Processing field: ${fieldName}`);

//       if (fieldName === "file" && value instanceof File) {
//         posterFile = value;
//       } else if (fieldName === "description" && typeof value === "string") {
//         descriptionText = value;
//       }
//     }

//     // Process image file
//     if (posterFile) {
//       console.log(
//         `Processing poster file: ${posterFile.name}, type: ${posterFile.type}, size: ${posterFile.size} bytes`
//       );

//       const arrayBuffer = await posterFile.arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);

//       const timestamp = Date.now();
//       const randomString = Math.random().toString(36).substring(2, 8);

//       let fileName: string;
//       let finalBuffer: Buffer;
//       let mimeType: string;

//       if (isDocumentFile(posterFile)) {
//         // Untuk dokumen, gunakan file asli tanpa optimasi
//         const originalExtension = posterFile.name
//           .split(".")
//           .pop()
//           ?.toLowerCase();
//         fileName = `${campaignId}-poster-${timestamp}-${randomString}.${originalExtension}`;
//         finalBuffer = buffer;
//         mimeType = getMimeType(posterFile.name);
//       } else {
//         // Untuk gambar, optimasi dengan Sharp
//         console.log(`Optimizing image: ${posterFile.name}`);
//         // const optimizedBuffer = await sharp(buffer)
//         //   .resize(1200, 800, { fit: "inside", withoutEnlargement: true })
//         //   .webp({ quality: 80 }) // Quality 80 untuk balance quality/size
//         //   .toBuffer();
//         const optimizedBuffer = await sharp(buffer)
//           .resize(1400, null, { withoutEnlargement: true })
//           .webp({
//             quality: 90,
//             nearLossless: true,
//             effort: 4,
//           })
//           .toBuffer();

//         fileName = `${campaignId}-poster-${timestamp}-${randomString}.webp`;
//         finalBuffer = optimizedBuffer;
//         mimeType = "image/webp";
//       }

//       console.log(`Uploading to Ceph: ${fileName}`);
//       await cephClient.uploadObject(fileName, finalBuffer, mimeType);
//       uploadedFiles["poster"] = `/api/cdn/${fileName}`;
//       uploadedFileNames.push(fileName);

//       console.log(`Uploaded poster: ${fileName}`);
//     }

//     // Process description text
//     if (descriptionText) {
//       console.log("Processing description text...");
//       const timestamp = Date.now();
//       const randomString = Math.random().toString(36).substring(2, 8);

//       // Sanitize HTML - hapus script/iframe tapi pertahankan formatting
//       const safeHtml = sanitizeHtmlManual(descriptionText);

//       // Simpan sebagai .txt file (berisi HTML yang aman)
//       const txtFileName = `${campaignId}-description-${timestamp}-${randomString}.txt`;
//       const txtBuffer = Buffer.from(safeHtml, "utf-8");

//       console.log(
//         `Creating description file: ${txtFileName}, size: ${txtBuffer.length} bytes`
//       );
//       await cephClient.uploadObject(txtFileName, txtBuffer, "text/plain");
//       uploadedFiles["description"] = `/api/cdn/${txtFileName}`;
//       uploadedFileNames.push(txtFileName);

//       console.log(`Description saved as: ${txtFileName}`);

//       // Log contoh HTML sebelum dan sesudah sanitize
//       console.log("\n=== HTML SANITIZATION EXAMPLE ===");
//       console.log("Original length:", descriptionText.length, "chars");
//       console.log("Sanitized length:", safeHtml.length, "chars");

//       // Contoh kecil untuk debug
//       if (descriptionText.length < 500) {
//         console.log(
//           "Original snippet:",
//           descriptionText.substring(0, 200) + "..."
//         );
//         console.log("Sanitized snippet:", safeHtml.substring(0, 200) + "...");
//       }
//     }

//     if (!posterFile && !descriptionText) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "No file or description provided",
//         },
//         { status: 400 }
//       );
//     }

//     console.log("Upload completed successfully");
//     console.log("Uploaded files:", uploadedFiles);

//     return NextResponse.json({
//       success: true,
//       message: "Files uploaded successfully",
//       result: uploadedFiles,
//       filenames: uploadedFileNames,
//       campaignId: campaignId,
//       timestamp: new Date().toISOString(),
//     });
//   } catch (err: any) {
//     console.error("UPLOAD ERROR:", err);
//     console.error("Error stack:", err.stack);

//     return NextResponse.json(
//       {
//         success: false,
//         error: err.message,
//         message: "Failed to upload files",
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   return NextResponse.json({
//     success: true,
//     message: "Upload API is running",
//     endpoints: {
//       POST: "Upload poster image and description",
//       parameters: {
//         file: "Image file (optimized to WebP, field name must be 'file')",
//         description: "HTML text (sanitized and saved as .txt file)",
//         campaignId: "Optional campaign identifier",
//       },
//       returns: {
//         "result.poster": "URL to uploaded image",
//         "result.description": "URL to sanitized HTML .txt file",
//       },
//     },
//   });
// }

// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import cephClient from "@/lib/ceph-client";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds timeout

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
  "csv",
  "ppt",
  "pptx",
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
  "text/csv",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

// Daftar MIME types untuk gambar
const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
];

// Maximum file sizes
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DOCUMENT_SIZE = 50 * 1024 * 1024; // 50MB

// Fungsi untuk mengecek apakah file adalah dokumen
function isDocumentFile(file: File): boolean {
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  const mimeType = file.type.toLowerCase();

  return (
    ALLOWED_DOCUMENT_EXTENSIONS.includes(fileExtension || "") ||
    DOCUMENT_MIME_TYPES.includes(mimeType)
  );
}

// Fungsi untuk mengecek apakah file adalah gambar
function isImageFile(file: File): boolean {
  const mimeType = file.type.toLowerCase();
  return IMAGE_MIME_TYPES.includes(mimeType);
}

// Fungsi untuk mendapatkan MIME type yang sesuai berdasarkan ekstensi file
function getMimeType(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase();

  const mimeMap: Record<string, string> = {
    // Documents
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xls: "application/vnd.ms-excel",
    txt: "text/plain",
    html: "text/html",
    htm: "text/html",
    csv: "text/csv",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    // Images
    webp: "image/webp",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    svg: "image/svg+xml",
    bmp: "image/bmp",
    tiff: "image/tiff",
    tif: "image/tiff",
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
    .replace(/<meta[^>]*http-equiv\s*=\s*["']?refresh["']?[^>]*>/gi, "")
    // Remove base tag
    .replace(/<base\b[^>]*>/gi, "")
    // Remove forms
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, "")
    // Remove input elements
    .replace(/<input\b[^>]*>/gi, "")
    .replace(/<button\b[^>]*>.*?<\/button>/gi, "")
    // Remove potentially malicious attributes
    .replace(/\s*(?:href|src)\s*=\s*["']?\s*javascript:[^"'>]*["']?/gi, "");

  // Tetap pertahankan formatting tags yang aman
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
    "img",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "caption",
    "col",
    "colgroup",
    "sup",
    "sub",
    "mark",
    "small",
    "abbr",
    "cite",
    "time",
    "data",
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
      !hrefMatch[1].toLowerCase().startsWith("javascript:") &&
      !hrefMatch[1].toLowerCase().startsWith("data:")
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

  // Hanya allow attributes yang aman untuk tag img
  safeHtml = safeHtml.replace(/<img\s+([^>]*)>/gi, (match, attributes) => {
    const srcMatch = attributes.match(/src\s*=\s*["']([^"']*)["']/i);
    const altMatch = attributes.match(/alt\s*=\s*["']([^"']*)["']/i);
    const titleMatch = attributes.match(/title\s*=\s*["']([^"']*)["']/i);
    const widthMatch = attributes.match(/width\s*=\s*["']([^"']*)["']/i);
    const heightMatch = attributes.match(/height\s*=\s*["']([^"']*)["']/i);

    const safeAttrs = [];
    if (
      srcMatch &&
      srcMatch[1] &&
      !srcMatch[1].toLowerCase().startsWith("javascript:") &&
      !srcMatch[1].toLowerCase().startsWith("data:")
    ) {
      safeAttrs.push(`src="${srcMatch[1]}"`);
    }
    if (altMatch) safeAttrs.push(`alt="${altMatch[1]}"`);
    if (titleMatch) safeAttrs.push(`title="${titleMatch[1]}"`);
    if (widthMatch) safeAttrs.push(`width="${widthMatch[1]}"`);
    if (heightMatch) safeAttrs.push(`height="${heightMatch[1]}"`);

    return `<img ${safeAttrs.join(" ")}>`;
  });

  return safeHtml;
}

// Validasi file sebelum upload
function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size based on type
  if (isImageFile(file) && file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `Image file too large. Maximum size is ${
        MAX_IMAGE_SIZE / 1024 / 1024
      }MB`,
    };
  }

  if (isDocumentFile(file) && file.size > MAX_DOCUMENT_SIZE) {
    return {
      valid: false,
      error: `Document file too large. Maximum size is ${
        MAX_DOCUMENT_SIZE / 1024 / 1024
      }MB`,
    };
  }

  // Check file type
  if (!isImageFile(file) && !isDocumentFile(file)) {
    return {
      valid: false,
      error: "File type not supported. Please upload images or documents only.",
    };
  }

  return { valid: true };
}

export async function POST(req: NextRequest) {
  console.log("=== API UPLOAD START ===");
  console.log(`Time: ${new Date().toISOString()}`);

  const startTime = Date.now();
  let uploadedFiles: Record<string, string> = {};
  let uploadedFileNames: string[] = [];

  try {
    // Parse form data
    const form = await req.formData();
    const campaignId =
      form.get("campaignId")?.toString() || Date.now().toString();

    console.log("Campaign ID:", campaignId);
    console.log("Form fields:", Array.from(form.keys()));

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

    // Validate that we have something to upload
    if (!posterFile && !descriptionText) {
      return NextResponse.json(
        {
          success: false,
          message: "No file or description provided",
        },
        { status: 400 }
      );
    }

    // Process image/document file
    if (posterFile) {
      console.log(`\n=== PROCESSING FILE ===`);
      console.log(`File name: ${posterFile.name}`);
      console.log(`File type: ${posterFile.type}`);
      console.log(`File size: ${posterFile.size} bytes`);

      // Validate file
      const validation = validateFile(posterFile);
      if (!validation.valid) {
        return NextResponse.json(
          {
            success: false,
            message: validation.error,
          },
          { status: 400 }
        );
      }

      const arrayBuffer = await posterFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 10);

      let fileName: string;
      let finalBuffer: Buffer;
      let mimeType: string;

      if (isDocumentFile(posterFile)) {
        // Untuk dokumen, gunakan file asli tanpa optimasi
        const originalExtension = posterFile.name
          .split(".")
          .pop()
          ?.toLowerCase();
        fileName = `${campaignId}-${"file"}-${timestamp}-${randomString}.${originalExtension}`;
        finalBuffer = buffer;
        mimeType = getMimeType(posterFile.name);

        console.log(`Document file detected: ${originalExtension}`);
        console.log(`Original MIME type: ${posterFile.type}`);
        console.log(`Assigned MIME type: ${mimeType}`);
      } else {
        // Untuk gambar, optimasi dengan Sharp
        console.log(`Image file detected, optimizing...`);

        try {
          const image = sharp(buffer);
          const metadata = await image.metadata();

          console.log(
            `Original dimensions: ${metadata.width}x${metadata.height}`
          );
          console.log(`Original format: ${metadata.format}`);

          // Resize hanya jika gambar terlalu besar
          let processingImage = image;
          if (metadata.width && metadata.width > 2000) {
            console.log(`Resizing from ${metadata.width}px to max 2000px`);
            processingImage = processingImage.resize(2000, null, {
              fit: "inside",
              withoutEnlargement: true,
            });
          }

          // Convert to WebP dengan kualitas optimal
          const optimizedBuffer = await processingImage
            .webp({
              quality: 85,
              effort: 4,
              nearLossless: true,
            })
            .toBuffer();

          console.log(
            `Optimized size: ${optimizedBuffer.length} bytes (${(
              ((buffer.length - optimizedBuffer.length) / buffer.length) *
              100
            ).toFixed(1)}% reduction)`
          );

          fileName = `${campaignId}-poster-${timestamp}-${randomString}.webp`;
          finalBuffer = optimizedBuffer;
          mimeType = "image/webp";
        } catch (sharpError: any) {
          console.error("Sharp processing error:", sharpError);
          // Fallback: use original buffer if sharp fails
          fileName = `${campaignId}-poster-${timestamp}-${randomString}.${posterFile.name
            .split(".")
            .pop()}`;
          finalBuffer = buffer;
          mimeType = getMimeType(posterFile.name);
          console.log(`Fallback to original file: ${fileName}`);
        }
      }

      console.log(`\n=== UPLOADING TO CEPH ===`);
      console.log(`File name: ${fileName}`);
      console.log(`MIME type: ${mimeType}`);
      console.log(`Buffer size: ${finalBuffer.length} bytes`);

      try {
        const uploadStartTime = Date.now();
        const fileUrl = await cephClient.uploadObject(
          fileName,
          finalBuffer,
          mimeType
        );
        const uploadTime = Date.now() - uploadStartTime;

        console.log(`✅ Upload successful in ${uploadTime}ms`);
        console.log(`File URL: ${fileUrl}`);

        uploadedFiles["poster"] = fileUrl;
        uploadedFiles["cdnUrl"] = `/api/cdn/${fileName}`; // Proxy URL
        uploadedFileNames.push(fileName);
      } catch (uploadError: any) {
        console.error("❌ Ceph upload failed:", uploadError);

        // Try to save locally for debugging
        try {
          const tempDir = path.join(process.cwd(), "temp_uploads");
          await fs.mkdir(tempDir, { recursive: true });
          const tempPath = path.join(tempDir, fileName);
          await fs.writeFile(tempPath, finalBuffer);
          console.log(`File saved locally for debugging: ${tempPath}`);
        } catch (fsError) {
          console.error("Could not save file locally:", fsError);
        }

        throw new Error(`Ceph upload failed: ${uploadError.message}`);
      }
    }

    // Process description text
    if (descriptionText) {
      console.log(`\n=== PROCESSING DESCRIPTION ===`);
      console.log(`Description length: ${descriptionText.length} characters`);

      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 10);

      // Sanitize HTML
      const safeHtml = sanitizeHtmlManual(descriptionText);
      console.log(`Sanitized length: ${safeHtml.length} characters`);

      // Save as HTML file (not TXT)
      const htmlFileName = `${campaignId}-description-${timestamp}-${randomString}.html`;
      const htmlBuffer = Buffer.from(
        `<div>
${safeHtml}</div>`,
        "utf-8"
      );

      console.log(`Creating description file: ${htmlFileName}`);
      console.log(`HTML file size: ${htmlBuffer.length} bytes`);

      try {
        const descriptionUrl = await cephClient.uploadObject(
          htmlFileName,
          htmlBuffer,
          "text/html"
        );

        console.log(`✅ Description uploaded: ${descriptionUrl}`);
        uploadedFiles["description"] = descriptionUrl;
        uploadedFiles["descriptionHtml"] = `/api/cdn/${htmlFileName}`;
        uploadedFileNames.push(htmlFileName);
      } catch (descError: any) {
        console.error("❌ Description upload failed:", descError);
        // Don't fail the whole request if description fails
        uploadedFiles["descriptionError"] = "Failed to upload description";
      }
    }

    const totalTime = Date.now() - startTime;
    console.log(`\n=== UPLOAD COMPLETED ===`);
    console.log(`Total time: ${totalTime}ms`);
    console.log(`Uploaded files: ${uploadedFileNames.length}`);
    console.log(`Success: ${Object.keys(uploadedFiles).length > 0}`);
    console.log("=================================\n");

    return NextResponse.json({
      success: true,
      message:
        uploadedFileNames.length > 0
          ? "Files uploaded successfully"
          : "No files were uploaded",
      result: uploadedFiles,
      filenames: uploadedFileNames,
      campaignId: campaignId,
      timestamp: new Date().toISOString(),
      uploadTime: totalTime,
      fileCount: uploadedFileNames.length,
    });
  } catch (err: any) {
    const totalTime = Date.now() - startTime;
    console.error(`\n❌ UPLOAD FAILED after ${totalTime}ms`);
    console.error("Error details:", {
      name: err.name,
      message: err.message,
      stack: err.stack?.split("\n").slice(0, 5).join("\n"),
    });

    // Determine appropriate status code and message
    let statusCode = 500;
    let userMessage = "Internal server error";

    if (err.message.includes("file too large")) {
      statusCode = 413;
      userMessage = err.message;
    } else if (err.message.includes("File type not supported")) {
      statusCode = 415;
      userMessage = err.message;
    } else if (
      err.message.includes("Ceph") ||
      err.message.includes("upload failed")
    ) {
      statusCode = 503;
      userMessage =
        "Storage service temporarily unavailable. Please try again.";
    } else if (
      err.message.includes("sharp") ||
      err.message.includes("image processing")
    ) {
      statusCode = 400;
      userMessage = "Invalid image file. Please check the image format.";
    }

    console.error(`Returning error: ${statusCode} - ${userMessage}`);

    return NextResponse.json(
      {
        success: false,
        error: err.message,
        message: userMessage,
        timestamp: new Date().toISOString(),
        uploadTime: totalTime,
        debug:
          process.env.NODE_ENV === "development"
            ? {
                stack: err.stack,
                name: err.name,
              }
            : undefined,
      },
      { status: statusCode }
    );
  }
}

export async function GET() {
  console.log("Upload API GET request");

  return NextResponse.json({
    success: true,
    message: "Upload API is running",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      POST: "Upload poster image and description",
      parameters: {
        file: "Image or document file (field name must be 'file')",
        description: "HTML text (sanitized and saved as .html file)",
        campaignId: "Optional campaign identifier",
      },
      limits: {
        maxImageSize: `${MAX_IMAGE_SIZE / 1024 / 1024}MB`,
        maxDocumentSize: `${MAX_DOCUMENT_SIZE / 1024 / 1024}MB`,
        allowedImageTypes: IMAGE_MIME_TYPES,
        allowedDocumentTypes: DOCUMENT_MIME_TYPES,
      },
      returns: {
        result: {
          poster: "URL to uploaded file",
          cdnUrl: "Proxy URL via /api/cdn/",
          description: "URL to sanitized HTML file (if provided)",
          descriptionHtml: "Proxy URL for HTML file",
        },
        filenames: "Array of uploaded filenames",
        campaignId: "Campaign identifier",
        uploadTime: "Total upload time in ms",
      },
    },
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
  });
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
