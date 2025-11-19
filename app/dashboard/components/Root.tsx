"use client";

import { ReactNode, useEffect } from "react";
import Sidebar from "./Sidebar";
import LeaderBoard from "./LeaderBoard";
import { useAuth } from "../../../hooks/useAuth"; // Import useAuth
import { useRouter } from "next/navigation"; // Import useRouter

interface RootProps {
  children: React.ReactNode;
  show?: boolean;
}

export default function Root({ children, show = false }: RootProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect jika user belum login
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Tampilkan loading saat authentication check
  if (loading) {
    return (
      <div className="min-h-screen bg-leaf-50 flex items-center justify-center">
        <div className="text-leaf-600 text-xl">Loading...</div>
      </div>
    );
  }

  // Jangan render apapun jika tidak ada user
  if (!user) {
    return null;
  }

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.min.css"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,300,0,0"
      />
      <div data-theme="emerald">
        <div className="w-full bg-leaf-300 flex flex-row">
          <Sidebar show={show} />
          <div className="w-full p-4 h-screen bg-leaf-50 flex flex-col gap-4">
            {/* Content */}
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
