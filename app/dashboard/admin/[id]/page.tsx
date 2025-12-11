"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Sesuaikan dengan path firebase config Anda

// Component untuk baris data donasi
function DonationRow({ donation }: { donation: any }) {
  return (
    <tr className="border border-gray-200 hover:bg-blue-50 cursor-pointer">
      <td className="border border-gray-200 p-4">{donation.date}</td>
      <td className="border border-gray-200 p-4 font-medium text-gray-900">
        {donation.name}
      </td>
      <td className="border border-gray-200 p-4">
        Rp {donation.amount.toLocaleString()}
      </td>
      <td className="border border-gray-200 p-4">
        <span className="badge !bg-leaf-700 !text-white">
          {" "}
          {donation.status}{" "}
        </span>
      </td>
      <td className="border border-gray-200 p-4 text-center cursor-pointer text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="inline-block h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      </td>
    </tr>
  );
}

// Component untuk menampilkan data statistik
function StatsSection({ campaign }: { campaign: any }) {
  return (
    <>
      <div className="p-6 col-span-2">
        <h3 className="text-gray-500 text-sm font-medium mb-2">Total Donasi</h3>
        <p className="md:text-5xl text-3xl font-bold text-gray-800">
          Rp {campaign.total_donasi?.toLocaleString() || 0}
        </p>
        <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
          <div
            className="bg-leaf-500 h-2 rounded-full"
            style={{ width: `${campaign.progress_percentage || 0}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {campaign.progress_percentage || 0}% dari Target Rp{" "}
          {campaign.target_donasi?.toLocaleString() || 0}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Pohon */}
        <div className="bg-gradient-to-r from-leaf-500 to-leaf-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Total Pohon</h2>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                <p className="text-xs text-leaf-100">Pohon yang ditanam</p>
                <p className="text-xl font-bold">{campaign.total_pohon || 0}</p>
              </div>
            </div>
          </div>
          <i className="bx bxs-tree absolute -bottom-4 -right-4 text-9xl text-white/10"></i>
        </div>

        {/* Total Donatur */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Total Donatur</h2>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                <p className="text-xs text-blue-100">Donatur</p>
                <p className="text-xl font-bold">
                  {campaign.total_donatur || 0}
                </p>
              </div>
            </div>
          </div>
          <i className="bx bxs-donate-heart bx-flip-horizontal absolute -bottom-4 -right-4 text-9xl text-white/10"></i>
        </div>
      </div>
    </>
  );
}

// Component untuk tabel donasi
function DonationTable() {
  return (
    <div className="w-full border-2 border-gray-200 rounded-xl flex text-black">
      <div className="md:flex-10 w-full">
        <div className="bg-white rounded-xl shadow-md p-4 max-w-full overflow-x-auto relative">
          <div className="sticky top-0 z-10 bg-white pb-4">
            <div className="flex justify-between w-full items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Tabel Histori
              </h2>
              <div className="flex gap-4 md:w-full">
                <button className="btn btn-xs !bg-leaf-700 !text-white">
                  <p className="md:text-sm text-xs">Export ke CSV</p>
                </button>
              </div>
            </div>
            <div className="mb-4 flex w-full space-x-4">
              <input
                type="text"
                placeholder="Search..."
                className="grow border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Filter</option>
              </select>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 sticky top-0">
                  <th className="border border-gray-200 md:p-4 p-2 text-center text-sm font-semibold text-gray-700">
                    Tanggal
                  </th>
                  <th className="border border-gray-200 md:p-4 p-2 text-center text-sm font-semibold text-gray-700">
                    Username
                  </th>
                  <th className="border border-gray-200 md:p-4 p-2 text-center text-sm font-semibold text-gray-700">
                    Jumlah
                  </th>
                  <th className="border border-gray-200 md:p-4 p-2 text-center text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="border border-gray-200 md:p-4 p-2 text-center w-16 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Data akan ditampilkan di sini nanti */}
                {/* Kosongkan tabel seperti yang diminta */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component untuk menampilkan data
function DataSection({ campaign }: { campaign: any }) {
  return (
    <>
      <StatsSection campaign={campaign} />
      <DonationTable />
    </>
  );
}

// Component untuk informasi kampanye
// Component untuk informasi kampanye
function CampaignInfo({ campaign }: { campaign: any }) {
  const [descriptionHtml, setDescriptionHtml] = useState<string>("");

  useEffect(() => {
    // Fetch deskripsi HTML dari URL jika ada
    const fetchDescription = async () => {
      if (campaign.deskripsi_url) {
        try {
          const response = await fetch(campaign.deskripsi_url);
          if (response.ok) {
            const htmlContent = await response.text();
            setDescriptionHtml(htmlContent);
          }
        } catch (error) {
          console.error("Error fetching description:", error);
        }
      }
    };

    fetchDescription();
  }, [campaign.deskripsi_url]);

  return (
    <div className="flex-1">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="space-y-6">
          {/* Image Section */}
          <div className="mb-6">
            <Image
              src={campaign.poster_url || "/assets/img/item/sinarmas.jpeg"}
              alt={campaign.judul}
              width={800}
              height={400}
              className="w-full h-48 object-cover rounded-xl"
            />
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul Kampanye
              </label>
              <h3 className="text-2xl font-bold">{campaign.judul}</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Donasi
              </label>
              <h3 className="text-xl">
                Rp{(campaign.target_donasi * 15000)?.toLocaleString() || 0}
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi
              </label>
              <h3 className="text-xl">{campaign.lokasi}</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Medan
              </label>
              <h3 className="text-xl">{campaign.medan || "-"}</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Pohon
              </label>
              <h3 className="text-xl">
                {campaign.jenis_pohon_asli || campaign.jenis_pohon || "-"}
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Planning
              </label>
              <h3 className="text-xl">
                {campaign.tanggal_planning
                  ? new Date(campaign.tanggal_planning).toLocaleDateString(
                      "id-ID",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "-"}
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai
              </label>
              <h3 className="text-xl">
                {campaign.tanggal_mulai
                  ? new Date(campaign.tanggal_mulai).toLocaleDateString(
                      "id-ID",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "-"}
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Berakhir
              </label>
              <h3 className="text-xl">
                {campaign.tanggal_berakhir
                  ? new Date(campaign.tanggal_berakhir).toLocaleDateString(
                      "id-ID",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "-"}
              </h3>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            {descriptionHtml ? (
              <div
                className="text-sm leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            ) : (
              <p className="text-sm text-gray-500">Deskripsi tidak tersedia</p>
            )}
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors w-2/5"
              onClick={() => window.history.back()}
            >
              <i className="bx bxs-edit mr-2"></i> Edit
            </button>

            <button
              type="button"
              className="px-6 py-3 border border-leaf-600 bg-leaf-600 text-white font-bold rounded-lg hover:bg-leaf-700 transition-colors w-2/5"
              onClick={() => {
                // TODO: Implement update logic
                console.log("Update campaign:", campaign.id);
              }}
            >
              <i className="bx bxs-save mr-2"></i> Update
            </button>

            <button
              type="button"
              className="px-6 py-3 border border-red-600 !bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors w-1/5"
              onClick={() => {
                // TODO: Implement delete logic
                if (
                  confirm("Apakah Anda yakin ingin menghapus kampanye ini?")
                ) {
                  console.log("Delete campaign:", campaign.id);
                }
              }}
            >
              <i className="bx bxs-trash mr-2"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component untuk sidebar deskripsi
function DescriptionSidebar({ campaign }: { campaign: any }) {
  return (
    <div className="flex md:hidden! flex-col w-full items-center bg-white rounded-2xl border-2 border-gray-100 p-4 h-max">
      <Image
        src={campaign.poster_url || "/assets/img/item/sinarmas.jpeg"}
        alt={campaign.judul}
        width={350}
        height={200}
        className="object-cover rounded-xl mt-4 w-full h-48"
      />

      <h3 className="text-lg font-bold mt-4 text-center">{campaign.judul}</h3>

      <div className="mt-4 inline-flex justify-between w-full">
        <p> Target Terkumpul </p>
        <p className="font-bold">
          {" "}
          Rp {campaign.target_donasi?.toLocaleString() || 0}
        </p>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
        <div
          className="bg-leaf-500 h-2 rounded-full"
          style={{ width: `${campaign.progress_percentage || 0}%` }}
        ></div>
      </div>

      <a
        href="/campaign/charity"
        className="btn !bg-leaf-700 text-white mt-4 w-full"
      >
        Check
      </a>
    </div>
  );
}

// Component utama untuk halaman detail kampanye
export default function CampaignDetailPage() {
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Deskripsi");
  const params = useParams();

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);

        // Pastikan params.id ada dan berupa string
        if (!params?.id) {
          setError("ID kampanye tidak ditemukan");
          setLoading(false);
          return;
        }

        const campaignId = params.id as string;
        console.log("Fetching campaign with ID:", campaignId);

        // Cara 1: Query dengan where clause
        const campaignsRef = collection(db, "campaignsv2");
        const q = query(campaignsRef, where("id", "==", campaignId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Ambil dokumen pertama yang cocok
          const campaignDoc = querySnapshot.docs[0];
          const campaignData = campaignDoc.data();
          console.log("Campaign data:", campaignData);

          setCampaign({
            id: campaignDoc.id, // ID dokumen Firebase
            ...campaignData, // Data termasuk id custom Anda
          });
        } else {
          setError("Kampanye tidak ditemukan");
        }
      } catch (err) {
        console.error("Error fetching campaign:", err);
        setError("Gagal memuat data kampanye");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [params?.id]); // Gunakan params?.id sebagai dependency

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-leaf-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Link
          href="/dashboard/admin"
          className="text-leaf-600 hover:underline mt-4 inline-block"
        >
          Kembali ke daftar kampanye
        </Link>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/admin" className="hover:text-leaf-600">
          Kampanye
        </Link>
        <i className="bx bx-chevron-right"></i>
        <span>{campaign.judul}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="md:text-3xl text-xl font-bold text-gray-800">
            {campaign.judul}
          </h1>
          <div className="flex md:flex-row flex-col gap-2 md:items-center mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <i className="bx bx-map"></i> {campaign.lokasi}
            </span>
            <span className="flex items-center gap-1">
              <i className="bx bx-calendar"></i>
              Tanam:{" "}
              {campaign.tanggal_berakhir
                ? new Date(campaign.tanggal_berakhir).toLocaleDateString(
                    "id-ID"
                  )
                : "-"}
            </span>
            <span className="md:inline-block hidden px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-bold">
              {campaign.status || "draft"}
            </span>
          </div>
          <span className="w-fit my-4 md:hidden px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-bold">
            {campaign.status || "draft"}
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2">
          <div className="flex p-0 border-2 border-gray-200 text-black rounded-lg">
            <button
              className={`cursor-pointer rounded-l-lg p-2 px-4 transition-all text-sm font-medium ${
                activeTab === "Deskripsi" ? "bg-leaf-500 text-white" : ""
              }`}
              onClick={() => setActiveTab("Deskripsi")}
            >
              Deskripsi
            </button>
            <button
              className={`cursor-pointer rounded-r-lg p-2 px-4 transition-all text-sm font-medium ${
                activeTab === "Data" ? "bg-leaf-500 text-white" : ""
              }`}
              onClick={() => setActiveTab("Data")}
            >
              Data
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 text-black flex md:flex-row flex-col gap-4">
        {/* Sidebar */}
        <DescriptionSidebar campaign={campaign} />

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "Deskripsi" && <CampaignInfo campaign={campaign} />}
          {activeTab === "Data" && <DataSection campaign={campaign} />}
        </div>
      </div>
    </div>
  );
}
