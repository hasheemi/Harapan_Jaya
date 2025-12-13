"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Campaign {
  id: string;
  campaignId: string;
  judul: string;
  status: string;
  target_donasi: number;
  total_donasi: number;
  total_pohon: number;
  total_donatur: number;
  progress_percentage: number;
  raised: number;
  target: number;
  trees: number;
  poster_url: string;
  lokasi: string;
  jenis_pohon: string;
  created_at: Date | null;
  updated_at: Date | null;
}

export default function AdminPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch campaigns from Firebase
  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        // Get user email from localStorage (adjust based on your auth setup)
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const userEmail = userData.email;

        if (!userEmail) {
          console.error("User email not found in localStorage");
          setCampaigns([]);
          return;
        }

        // Create query to filter by user's email
        const campaignsRef = collection(db, "campaignsv2");
        const q = query(
          campaignsRef,
          where("created_by_email", "==", userEmail)

        );
        const now = new Date();
        const querySnapshot = await getDocs(q);
        const campaignsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          // Calculate financial values
          const targetDonasi = data.target_donasi || 0;
          const totalPohon = data.total_pohon || 0;
          const totalDonasi = data.total_donasi || 0;
          const treeValue = 15000; // Value per tree

          // Get dates
          const tanggal_mulai = data.tanggal_mulai
            ? (data.tanggal_mulai.toDate ? data.tanggal_mulai.toDate() : new Date(data.tanggal_mulai))
            : null;
          const tanggal_berakhir = data.tanggal_berakhir
            ? (data.tanggal_berakhir.toDate ? data.tanggal_berakhir.toDate() : new Date(data.tanggal_berakhir))
            : null;
          // console.log(tanggal_mulai, tanggal_berakhir);

          // Calculate status based on dates
          if (tanggal_mulai && tanggal_berakhir) {
            // Pastikan kedua tanggal adalah Date object yang valid
            const startDate = tanggal_mulai instanceof Date ? tanggal_mulai : new Date(tanggal_mulai);
            const endDate = tanggal_berakhir instanceof Date ? tanggal_berakhir : new Date(tanggal_berakhir);

            console.log("Comparing dates:", {
              start: startDate,
              end: endDate,
              now: now,
              startValid: !isNaN(startDate.getTime()),
              endValid: !isNaN(endDate.getTime())
            });

            if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
              if (now >= startDate && now <= endDate) {
                status = "active";
              } else if (now > endDate) {
                status = "closed";
              } else if (now < startDate) {
                status = "draft";
              }
            }
          } else if (tanggal_mulai) {
            const startDate = tanggal_mulai instanceof Date ? tanggal_mulai : new Date(tanggal_mulai);

            if (!isNaN(startDate.getTime())) {
              if (now >= startDate) {
                status = "active";
              } else {
                status = "draft";
              }
            }
          }

          console.log("Final status:", status);


          return {
            // Document ID for linking
            id: doc.id,

            // Campaign data from your schema
            campaignId: data.id || doc.id,
            judul: data.judul || "Untitled Campaign",
            status: status, // Use calculated status instead of data.status
            target_donasi: targetDonasi,
            total_donasi: totalDonasi,
            total_pohon: totalPohon,
            total_donatur: data.total_donatur || 0,
            progress_percentage: data.progress_percentage || 0,

            // Calculated values for display
            raised: totalDonasi > 0 ? totalDonasi : totalPohon * treeValue,
            target: targetDonasi * treeValue,
            trees: totalPohon,

            // Other fields
            poster_url: data.poster_url || "",
            lokasi: data.lokasi || "",
            jenis_pohon: data.jenis_pohon || "",
            tanggal_mulai: tanggal_mulai,
            tanggal_berakhir: tanggal_berakhir,
            created_at: data.created_at?.toDate?.() || null,
            updated_at: data.updated_at?.toDate?.() || null,
          };
        });

        setCampaigns(campaignsData);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        setCampaigns([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Filter campaigns based on search term
  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.jenis_pohon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (date: any) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get status badge color
  const getStatusColor = (status: any) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Translate status to Indonesian
  const translateStatus = (status: any) => {
    switch (status?.toLowerCase()) {
      case "draft":
        return "Draft";
      case "active":
        return "Aktif";
      case "completed":
        return "Selesai";
      case "closed":
        return "Tutup";
      case "archived":
        return "Diarsipkan";
      default:
        return status || "Draft";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Kampanye Saya
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola dan pantau kampanye yang telah Anda buat
            </p>
          </div>
          <Link
            href="/dashboard/admin/add"
            className="inline-flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Buat Kampanye Baru
          </Link>
        </div>

        {/* Campaigns Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Memuat kampanye...</p>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "Tidak ditemukan kampanye" : "Belum ada kampanye"}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {searchTerm
                  ? "Coba gunakan kata kunci lain atau hapus pencarian"
                  : "Mulai dengan membuat kampanye pertama Anda untuk menggalang dana penanaman pohon"}
              </p>
              {!searchTerm && (
                <Link
                  href="/dashboard/admin/add"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Buat Kampanye Pertama
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Daftar Kampanye
                  </h2>
                  <span className="text-sm text-gray-500">
                    {filteredCampaigns.length} dari {campaigns.length} kampanye
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kampanye
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lokasi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Dana
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pohon Tertanam
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dibuat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCampaigns.map((campaign) => (
                      <tr
                        key={campaign.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-gray-100 mr-4">
                              {campaign.poster_url ? (
                                <Image
                                  src={campaign.poster_url}
                                  alt={campaign.judul}
                                  width={48}
                                  height={48}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-green-50 text-green-600">
                                  <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1.5}
                                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {campaign.judul}
                              </div>
                              <div className="text-sm text-gray-500">
                                {campaign.jenis_pohon}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              campaign.status
                            )}`}
                          >
                            {translateStatus(campaign.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {campaign.lokasi || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Rp {campaign.raised.toLocaleString("id-ID")}
                          </div>
                          <div className="text-xs text-gray-500">
                            dari Rp {campaign.target.toLocaleString("id-ID")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🌲</span>
                            <span className="text-sm font-medium text-gray-900">
                              {campaign.trees}
                            </span>
                            <span className="text-xs text-gray-500">pohon</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(campaign.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            href={`/dashboard/admin/${campaign.campaignId}`}
                            className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-900"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Kelola
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
