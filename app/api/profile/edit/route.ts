// app/api/profile/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  updateDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      phoneNumber,
      yayasanName,
      yayasanPhone,
      yayasanAddress,
      yayasanNPWP,
      yayasanSocialMedia,
      email, // Tambahkan email dari request body
    } = body;

    if (!email) {
      return NextResponse.json(
        {
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    const usersRef = collection(db, "usersv2");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, "usersv2", userDoc.id);

    const updateData = {
      name: fullName,
      yayasanTel: yayasanPhone,
      yayasanName,
      yayasanLoc: yayasanAddress,
      yayasanNPWP,
      yayasanSoc: yayasanSocialMedia,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(userRef, updateData);

    return NextResponse.json({
      message: "Profile updated successfully",
      data: updateData,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
