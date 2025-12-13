"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function HistoryPage() {
    const [userDonations, setUserDonations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

      // Ambil data user dari localStorage
      const [localData, setLocalData] = useState<any>(null);
    
      useEffect(() => {
        // Ambil data user dari localStorage
        try {
          const stored = localStorage.getItem("user");
          if (stored) {
            const parsedData = JSON.parse(stored);
            setLocalData(parsedData);
          }
        } catch (err) {
          console.warn("LocalStorage parse failed:", err);
        }
      }, []);

        // Ambil data donasi user dari Firebase
        useEffect(() => {
          const fetchUserDonations = async () => {
            if (!localData?.email) return;
      
            setIsLoading(true);
            try {
              const transactionsRef = collection(db, "transactionsv2");
              const q = query(
                transactionsRef,
                where("user_email", "==", localData.email),
                orderBy("created_at", "desc"),
                limit(6)
              );
      
              const querySnapshot = await getDocs(q);
              const donations: any[] = [];
      
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                donations.push({
                  id: doc.id,
                  ...data,
                  created_at: data.created_at?.toDate?.() || null,
                });
              });
      
              setUserDonations(donations);
            } catch (error) {
              console.error("Error fetching user donations:", error);
            } finally {
              setIsLoading(false);
            }
          };
      
          fetchUserDonations();
        }, [localData?.email]);

  function formatDate(isoString: any) {
    if (!isoString) return "";
    const d = new Date(isoString);

    const monthNames = [
      "januari",
      "februari",
      "maret",
      "april",
      "mei",
      "juni",
      "juli",
      "agustus",
      "september",
      "oktober",
      "november",
      "desember",
    ];

    const day = d.getDate();
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${month} ${year}`;
  }

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return "-";
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari lalu`;

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

    return (
      <>
      <div className="flex flex-col md:flex-row  md:items-center gap-4">
        <Link href="/dashboard">
          <button className="px-2 hover:bg-green-400 border-2 border-gray-300 py-2"><i className="bx bx-arrow-back"></i></button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Peta</h1>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Riwayat Donasi</h3>
              {userDonations.length >= 0 && (
                <Link
                  href="/dashboard/history/maps"
                  className="text-sm text-leaf-600 hover:text-leaf-700 font-medium"
                >
                  <button
                    type="button"
                    className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <i className="bx bxs-map mr-2"></i> Lihat Peta
                  </button>
                </Link>
              )}
            </div>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">Memuat data...</p>
                </div>
              ) : userDonations.length > 0 ? (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                      <th className="px-6 py-3 font-medium">Kampanye</th>
                      <th className="px-6 py-3 font-medium">
                        Pohon yang ditanam
                      </th>
                      <th className="px-6 py-3 font-medium">Tanggal</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {userDonations.map((donation) => (
                      <tr
                        key={donation.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                          {donation.campaign_title || "Donasi Pohon"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {donation.jumlah_pohon || 0}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDisplayDate(donation.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="badge !bg-leaf-700 !text-white">
                            Sukses
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center">
                  <div className="text-gray-400 mb-4">
                    <i className="bx bx-tree text-5xl"></i>
                  </div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">
                    Belum ada donasi
                  </h4>
                  <p className="text-gray-500 mb-4">
                    Mulai kontribusi Anda untuk lingkungan dengan donasi pohon
                    pertama!
                  </p>
                  <Link
                    href="/dashboard/campaigns"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-leaf-500 hover:bg-leaf-700 text-white rounded-lg transition-colors"
                  >
                    <i className="bx bx-plus-circle"></i>
                    Donasi Sekarang
                  </Link>
                </div>
              )}
            </div>
          </div>
      </>
    );
}
