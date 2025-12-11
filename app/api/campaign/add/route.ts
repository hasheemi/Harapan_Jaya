import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    // 1. Get form data
    const formData = await request.formData();

    // 2. Extract text fields
    const judul = formData.get("judul") as string;
    const targetDonasi = parseFloat(formData.get("target_donasi") as string);
    const lokasi = formData.get("lokasi") as string;
    const tanggalMulai = formData.get("tanggal_mulai") as string;
    const tanggalBerakhir = formData.get("tanggal_berakhir") as string;
    const tanggalPlanning = formData.get("tanggal_planning") as string;
    const deskripsi = formData.get("deskripsi") as string;
    const medan = formData.get("medan") as string;
    const jenisPohon = formData.get("jenis_pohon") as string;
    const jenisPohonAsli = formData.get("jenis_pohon_asli") as string;
    const lat = parseFloat(formData.get("lat") as string);
    const lng = parseFloat(formData.get("lng") as string);
    const userId = formData.get("userId") as string;
    const userEmail = formData.get("userEmail") as string;
    const posterFile = formData.get("file") as File; // Field name harus 'file'

    // 3. Validation
    const requiredFields = [
      { field: judul, name: "judul" },
      { field: targetDonasi, name: "target_donasi" },
      { field: lokasi, name: "lokasi" },
      { field: tanggalMulai, name: "tanggal_mulai" },
      { field: tanggalBerakhir, name: "tanggal_berakhir" },
      { field: tanggalPlanning, name: "tanggal_planning" },
      { field: deskripsi, name: "deskripsi" },
      { field: medan, name: "medan" },
      { field: jenisPohon, name: "jenis_pohon" },
      { field: lat, name: "lat" },
      { field: lng, name: "lng" },
      { field: userId, name: "userId" },
      { field: userEmail, name: "userEmail" },
      { field: posterFile, name: "file" }, // Validation untuk file
    ];

    const missingFields = requiredFields
      .filter(({ field }) => !field)
      .map(({ name }) => name);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Field berikut wajib diisi: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // 4. Upload file dan deskripsi ke /api/upload
    console.log("Uploading files to /api/upload...");

    const uploadFormData = new FormData();
    uploadFormData.append("file", posterFile); // Field name harus 'file'
    uploadFormData.append("description", deskripsi); // HTML description
    uploadFormData.append("campaignId", Date.now().toString()); // temp ID

    const uploadResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || request.nextUrl.origin}/api/upload`,
      {
        method: "POST",
        body: uploadFormData,
      }
    );

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      console.error("Upload API error:", errorData);
      throw new Error(errorData.message || "Failed to upload files");
    }

    const uploadResult = await uploadResponse.json();
    console.log("Upload API result:", uploadResult);

    // 5. Prepare campaign data for Firestore
    const generateCampaignId = () => {
      const random5Digit = Math.floor(10000 + Math.random() * 90000); // 10000-99999
      const timestamp = Date.now().toString().slice(-4); // 4 digit terakhir timestamp
      return `${random5Digit}${timestamp}`;
    };

    const campaignId = generateCampaignId();

    const campaignData = {
      // ID unik kampanye
      id: campaignId,
      judul: judul.trim(),
      target_donasi: targetDonasi,
      lokasi: lokasi.trim(),
      tanggal_mulai: new Date(tanggalMulai).toISOString(),
      tanggal_berakhir: new Date(tanggalBerakhir).toISOString(),
      tanggal_planning: new Date(tanggalPlanning).toISOString(),
      poster_url: uploadResult.result?.poster || "",
      deskripsi_url: uploadResult.result?.description || "",

      // Data tanaman
      medan: medan,
      jenis_pohon: jenisPohon.trim(),
      jenis_pohon_asli: jenisPohonAsli || jenisPohon.trim(),
      lokasi_lat: lat,
      lokasi_lng: lng,

      // Metadata
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      status: "draft",
      created_by: userId,
      created_by_email: userEmail,
      created_by_yayasan: (formData.get("userName") as string) || null,

      // Stats (initial values)
      total_donasi: 0,
      total_donatur: 0,
      total_pohon: 0,
      progress_percentage: 0,

      // Upload metadata
      upload_image_filename:
        uploadResult.filenames?.find((f: string) => f.includes("poster-")) ||
        "",
      upload_description_filename:
        uploadResult.filenames?.find((f: string) =>
          f.includes("description-")
        ) || "",
      upload_timestamp: new Date().toISOString(),
      upload_campaign_id_temp: uploadResult.campaignId,
    };

    // // 6. Save to Firestore
    const campaignRef = await addDoc(
      collection(db, "campaignsv2"),
      campaignData
    );

    console.log(`Campaign saved to Firestore with ID: ${campaignRef.id}`);

    // 7. Return success response
    return NextResponse.json({
      success: true,
      message: "Campaign created successfully",
      data: {
        id: "",
        judul: campaignData.judul,
        lokasi: campaignData.lokasi,
        poster_url: campaignData.poster_url,
        deskripsi_sanitized_url: campaignData.deskripsi_url,
        status: campaignData.status,
        created_at: new Date().toISOString(),
      },
      upload_info: {
        image_uploaded: !!uploadResult.result?.poster,
        description_uploaded: !!uploadResult.result?.description,
        filenames: uploadResult.filenames,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error creating campaign:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create campaign",
        error: error.message || "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: "Method not allowed",
    },
    { status: 405 }
  );
}
