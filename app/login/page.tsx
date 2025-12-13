// app/login/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"email" | "provider">("provider");
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Email OTP logic would go here
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userRef = doc(db, "usersv2", user.uid);

      const userDoc = await getDoc(userRef);

      let userData;

      if (!userDoc.exists()) {
        userData = {
          createdAt: new Date().toISOString(), // string format ISO
          email: user.email || "",
          isYayasan: "false", // default false karena donatur
          name: user.displayName || "",
          photo: user.photoURL || "",
          role: "donatur", // role pertama sebagai donatur
          yayasanLoc: "", // string kosong
          yayasanName: "", // string kosong
          yayasanTel: "",
          yayasanNPWP: "",

          lastDonationTimestamp: "",
          lastUpdatedRank: "",
          rank: 0,
          totalDonation: 0,
        };
        await setDoc(userRef, userData);
      } else {
        userData = userDoc.data();
        const updateData: any = {};

        if (!userData.createdAt)
          updateData.createdAt = new Date().toISOString();
        if (!userData.isYayasan) updateData.isYayasan = "false";
        if (!userData.role) updateData.role = "donatur";
        if (!userData.yayasanLoc) updateData.yayasanLoc = "";
        if (!userData.yayasanName) updateData.yayasanName = "";

        if (Object.keys(updateData).length > 0) {
          await setDoc(userRef, updateData, { merge: true });
          userData = { ...userData, ...updateData };
        }
      }
      localStorage.setItem("user", JSON.stringify(userData));

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-leaf-50 w-screen min-h-screen md:min-h-1 md:h-screen relative flex login-page justify-center items-center">
      <div className="login bg-leaf-50 w-4/5 lg:w-[65%] md:!h-[90%] p-4 m-auto relative z-20 rounded-xl shadow-xl flex flex-col md:flex-row md:justify-between gap-4 md:gap-0 my-10 md:my-0">
        {/* Left Section - Login Form */}
        <div className="left w-full md:w-[55%] flex flex-col justify-center items-center bg-[#f4fff0] rounded-l-xl">
          <h2 className="text-3xl md:!text-5xl text-leaf-975 font-bold mb-6 mt-6 md:mt-4 relogo">
            Login Resapling
          </h2>

          <div className="w-11/12 md:w-3/4 mx-auto transition duration-300">
            {/* Provider Login */}
            {activeTab === "provider" && (
              <div className="space-y-4 py-12">
                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded flex items-center justify-center gap-2 transition duration-300 w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Image
                      src="/google.svg"
                      width={20}
                      height={20}
                      alt="Google logo"
                      className="h-5 w-5"
                    />
                    {isLoading ? "Loading..." : "Continue with Google"}
                  </button>
                </div>

                <div className="text-center text-sm text-gray-600">
                  <p>Login menggunakan akun Google Anda</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Image & Quote */}
        <div className="right w-full md:w-[45%] p-4 relative flex items-end">
          <Image
            src="/assets/img/background/aloha.jpg"
            alt="Nature background"
            width={500}
            height={600}
            className="w-full aspect-video md:aspect-auto h-auto md:h-full object-cover obje rounded-lg shadow-2xl static md:absolute inset-0 hidden md:block"
            priority
          />
          <div className="quote w-full p-4 rounded-lg bg-white relative z-10 text-sm shadow-lg">
            <blockquote className="w-full">
              Hutan adalah paru-paru bumi kita sendiri, memurnikan udara dan
              memberikan kekuatan segar kepada rakyat kita.
              <span className="italic font-light">~ Franklin D. Roosevelt</span>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
