// app/login/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"email" | "provider">("email");
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

      // Simpan user data ke localStorage atau state management
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };

      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect ke dashboard
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      // Handle error (tampilkan notifikasi, dll)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-leaf-50 w-screen min-h-screen md:min-h-1 md:h-screen relative flex login-page justify-center items-center">
      <div className="login bg-leaf-50 w-4/5 lg:w-[65%] md:!h-[90%] p-4 m-auto relative z-20 rounded-xl shadow-xl flex flex-col md:flex-row md:justify-between gap-4 md:gap-0 my-10 md:my-0">
        {/* Left Section - Login Form */}
        <div className="left w-full md:w-[55%] flex flex-col justify-center items-center bg-[#f4fff0] rounded-l-xl">
          <h2 className="text-3xl text-leaf-975 font-bold mb-6 mt-6 md:mt-4">
            Login Resapling
          </h2>

          <div className="w-11/12 md:w-3/4 mx-auto transition duration-300">
            {/* Tab Navigation */}
            <div className="flex mb-6 border-b border-gray-200">
              <button
                className={`flex-1 py-2 px-4 text-center font-medium focus:outline-none !ring-leaf-400 ${
                  activeTab === "email"
                    ? "text-white border-b-2 border-leaf-600 bg-leaf-500"
                    : "text-gray-500 hover:text-leaf-500"
                }`}
                onClick={() => setActiveTab("email")}
              >
                Email OTP
              </button>
              <button
                className={`flex-1 py-2 px-4 text-center font-medium focus:outline-none !ring-leaf-400 ${
                  activeTab === "provider"
                    ? "text-white border-b-2 border-leaf-600 bg-leaf-500"
                    : "text-gray-500 hover:text-leaf-500"
                }`}
                onClick={() => setActiveTab("provider")}
              >
                Akun Google
              </button>
            </div>

            {/* Email OTP Login */}
            {activeTab === "email" && (
              <form onSubmit={handleEmailLogin} className="space-y-4 py-2">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    className="border text-sm shadow-lg appearance-none rounded-lg w-full py-3 px-6 leading-tight border-gray-400 focus:border-2 focus:border-leaf-500 focus:outline-none"
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <button
                    className="bg-leaf-600 hover:bg-leaf-700 text-white font-bold py-3 px-6 rounded w-full transition duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Mengirim OTP..." : "Send OTP"}
                  </button>
                </div>

                <div className="text-center text-sm text-gray-600">
                  <p>Kami akan mengirim kode OTP ke email Anda</p>
                </div>
              </form>
            )}

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
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
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
