import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract semua data teks dari FormData
    const textData: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      // Hanya ambil yang bukan file (string)
      if (typeof value === "string") {
        textData[key] = value;
      }
    }

    // Log untuk debugging
    console.log("Received upgrade data:", textData);

    // Kembalikan data teks sebagai JSON response
    return NextResponse.json({
      success: true,
      message: "Data berhasil diterima",
      receivedData: textData,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("UPGRADE API ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
