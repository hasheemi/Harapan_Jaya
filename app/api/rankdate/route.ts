// app/api/update-rank/route.ts - SIMPLIFIED VERSION
import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  query,
  orderBy,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  try {
    // Optional: Simple authentication
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🔄 Memulai proses update rank...");

    // 1. Ambil semua users dengan totalPohon > 0, urutkan
    const usersRef = collection(db, "usersv2");
    const q = query(
      usersRef,
      orderBy("totalPohon", "desc"),
      orderBy("name", "asc")
    );

    const snapshot = await getDocs(q);

    // 2. Update rank secara berurutan
    const batch = writeBatch(db);
    let rank = 1;
    let previousPohon = -1;
    let actualRank = 1;

    snapshot.forEach((doc: any) => {
      const userData = doc.data();
      const totalPohon = userData.totalPohon || 0;

      // Jika pohon sama dengan sebelumnya, rank tetap sama
      if (totalPohon === previousPohon) {
        // Rank sama dengan sebelumnya (tie)
      } else {
        actualRank = rank;
      }

      // Hanya update rank jika totalPohon > 0
      if (totalPohon > 0) {
        batch.update(doc.ref, {
          rank: actualRank,
          rankUpdatedAt: new Date(),
        });
      } else {
        batch.update(doc.ref, {
          rank: null,
          rankUpdatedAt: new Date(),
        });
      }

      previousPohon = totalPohon;
      rank++;
    });

    // 3. Commit semua perubahan
    await batch.commit();
    console.log(`✅ Rank updated for ${snapshot.size} users`);

    return NextResponse.json({
      success: true,
      message: `Rank berhasil diupdate untuk ${snapshot.size} users`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Error updating ranks:", error);
    return NextResponse.json({ error: "Gagal update rank" }, { status: 500 });
  }
}
