// app/api/donate/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log("📥 Data diterima:", {
      jumlah_pohon: data.jumlah_pohon,
      total_donasi: data.total_donasi,
      user_email: data.user_email,
      campaign_id: data.campaign_id,
    });

    // Validasi data
    if (!data.jumlah_pohon || !data.total_donasi || !data.campaign_id) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const tanggal = new Date();

    // 1. Simpan transaksi ke transactionsv2
    console.log("💾 Menyimpan transaksi...");
    const transactionRef = await addDoc(collection(db, "transactionsv2"), {
      jumlah_pohon: data.jumlah_pohon,
      total_donasi: data.total_donasi,
      user_email: data.user_email || "anonim@example.com",
      user_name: data.user_name || "Donatur Anonim",
      user_photo: data.user_photo || "",
      campaign_id: data.campaign_id,
      campaign_title: data.campaign_title || "",
      campaign_yayasan: data.campaign_yayasan || "",
      lokasi: data.lokasi || "",
      jenis_pohon: data.jenis_pohon || "",
      is_anonim: data.is_anonim || false,
      status: "completed",
      payment_method: "qris",
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    console.log("✅ Transaksi tersimpan dengan ID:", transactionRef.id);

    // 2. Update campaign data di campaignsv2
    try {
      console.log("🔄 Mencari campaign...");
      const campaignsRef = collection(db, "campaignsv2");
      const campaignQuery = query(
        campaignsRef,
        where("id", "==", data.campaign_id)
      );
      const campaignSnapshot = await getDocs(campaignQuery);

      if (!campaignSnapshot.empty) {
        const campaignDoc = campaignSnapshot.docs[0];
        const campaignData = campaignDoc.data();

        const currentTotalDonasi = campaignData.total_donasi || 0;
        const currentTotalPohon = campaignData.total_pohon || 0;
        const currentTotalDonatur = campaignData.total_donatur || 0;

        const newTotalDonasi = currentTotalDonasi + data.total_donasi;
        const newTotalPohon = currentTotalPohon + data.jumlah_pohon;
        const newTotalDonatur = currentTotalDonatur + 1;

        const targetDonasi = (campaignData.target_donasi || 0) * 15000;
        const newProgress =
          targetDonasi > 0
            ? Math.round((newTotalDonasi / targetDonasi) * 100)
            : 0;

        await updateDoc(doc(db, "campaignsv2", campaignDoc.id), {
          total_donasi: newTotalDonasi,
          total_pohon: newTotalPohon,
          total_donatur: newTotalDonatur,
          progress_percentage: newProgress,
          updated_at: serverTimestamp(),
        });

        console.log("✅ Campaign updated:", {
          campaign_id: data.campaign_id,
          total_donasi: newTotalDonasi,
          total_pohon: newTotalPohon,
          total_donatur: newTotalDonatur,
        });
      } else {
        console.warn("⚠️ Campaign tidak ditemukan:", data.campaign_id);
      }
    } catch (campaignError: any) {
      console.error("❌ Error update campaign:", campaignError.message);
      // Jangan return error, lanjutkan karena transaksi sudah tersimpan
    }

    // 3. Update user data di usersv2 (jika bukan anonim)
    try {
      if (data.user_email && data.user_email !== "anonim@example.com") {
        console.log("👤 Mencari user dengan email:", data.user_email);

        const usersRef = collection(db, "usersv2");
        const userQuery = query(
          usersRef,
          where("email", "==", data.user_email)
        );
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();

          // Hitung total yang baru
          const currentTotalRupiah = userData.totalDonation || 0;
          const newTotalRupiah = currentTotalRupiah + data.total_donasi;

          const currentTotalPohon = userData.totalPohon || 0;
          const newTotalPohon = currentTotalPohon + data.jumlah_pohon;

          const updateData: any = {
            totalDonation: newTotalRupiah,
            totalPohon: newTotalPohon,
            lastDonationTimestamp: tanggal,
            updatedAt: serverTimestamp(),
          };

          // Jika ini donasi pertama, set firstDonationDate
          if (!userData.firstDonationDate) {
            updateData.firstDonationDate = tanggal;
          }

          await updateDoc(doc(db, "usersv2", userDoc.id), updateData);

          console.log("✅ User updated:", {
            email: data.user_email,
            totalDonation: newTotalRupiah,
            totalPohon: newTotalPohon,
            userId: userDoc.id,
          });
        } else {
          console.warn(
            "⚠️ User tidak ditemukan dengan email:",
            data.user_email
          );

          // Opsional: Buat user baru jika tidak ditemukan
          // await addDoc(collection(db, "usersv2"), {
          //   email: data.user_email,
          //   name: data.user_name || "",
          //   photo: data.user_photo || "",
          //   totalDonation: data.total_donasi,
          //   totalPohon: data.jumlah_pohon,
          //   firstDonationDate: tanggal,
          //   lastDonationTimestamp: tanggal,
          //   createdAt: serverTimestamp(),
          //   updatedAt: serverTimestamp()
          // });
        }
      } else {
        console.log("👤 Donasi anonim, skip update user");
      }
    } catch (userError: any) {
      console.error("❌ Error update user:", userError.message);
      // Lanjutkan karena transaksi utama sudah berhasil
    }

    // 4. Response sukses
    return NextResponse.json(
      {
        success: true,
        message: "Donasi berhasil diproses",
        transactionId: transactionRef.id,
        data: {
          jumlah_pohon: data.jumlah_pohon,
          total_donasi: data.total_donasi,
          campaign_id: data.campaign_id,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error utama dalam proses donasi:", error);

    return NextResponse.json(
      {
        error: "Gagal memproses donasi",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// Opsional: Tambahkan GET untuk debugging
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: "API Donasi aktif",
      method: "POST",
      required_fields: [
        "jumlah_pohon",
        "total_donasi",
        "campaign_id",
        "user_email (opsional)",
      ],
    },
    { status: 200 }
  );
}
