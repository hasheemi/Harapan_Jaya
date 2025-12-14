// app/api/update-rank/route.ts
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
    // 🔐 Auth via query param
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    if (secret !== process.env.CRON_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const usersRef = collection(db, "usersv2");
    const q = query(
      usersRef,
      orderBy("totalPohon", "desc"),
      orderBy("name", "asc")
    );

    const snapshot = await getDocs(q);

    // Hitung & update rank
    const batch = writeBatch(db);
    let rank = 1;
    let previousPohon = -1;
    let actualRank = 1;

    snapshot.forEach((doc) => {
      const userData = doc.data();
      const totalPohon = userData.totalPohon || 0;

      if (totalPohon !== previousPohon) {
        actualRank = rank;
      }

      batch.update(doc.ref, {
        rank: totalPohon > 0 ? actualRank : null,
        rankUpdatedAt: new Date(),
      });

      previousPohon = totalPohon;
      rank++;
    });

    await batch.commit();

    console.log(`Rank updated for ${snapshot.size} users`);

    return NextResponse.json({
      success: true,
      updatedUsers: snapshot.size,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error updating ranks:", error);
    return NextResponse.json({ error: "Gagal update rank" }, { status: 500 });
  }
}

