"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Update {
  judul: string;
  deskripsi: string;
  tanggal: string;
  author: string;
  created_at: string;
  image_url?: string;
  campaign_id?: string;
}

interface CampaignData {
  id: string;
  judul: string;
  lokasi: string;
  jenis_pohon: string;
  medan: string;
  poster_url: string;
  tanggal_mulai: string;
  tanggal_berakhir: string;
  created_by_yayasan: string;
  updates?: Update[];
}

interface TabSectionProps {
  campaignData: CampaignData;
  updates?: Update[];
  deskripsiHtml: any;
}

export default function TabSection({
  campaignData,
  updates = [],
  deskripsiHtml,
}: TabSectionProps) {
  const [activeTab, setActiveTab] = useState<"desc" | "update">("desc");

  // Format tanggal
  const formatDate = (dateString: string) => {
    if (!dateString) return "Tanggal tidak ditentukan";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Generate tag berdasarkan jenis pohon dan medan
  const getTags = () => {
    const tags = [];

    if (campaignData.lokasi) {
      tags.push(`📍 ${campaignData.lokasi}`);
    }

    if (campaignData.jenis_pohon) {
      tags.push(
        `🌱 ${
          campaignData.jenis_pohon.charAt(0).toUpperCase() +
          campaignData.jenis_pohon.slice(1)
        }`
      );
    }

    if (campaignData.medan) {
      const medanMap: Record<string, string> = {
        hutan: "🏞️ Hutan",
        pesisir: "🏝️ Pesisir",
        lahan_kritis: "⚠️ Lahan Kritis",
      };
      tags.push(medanMap[campaignData.medan] || campaignData.medan);
    }

    return tags;
  };

  console.log(campaignData);

  return (
    <div className="px-6 sm:px-12">
      <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6 w-4/5">
        {campaignData.judul}
      </h2>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-300 mb-4">
        <button
          onClick={() => setActiveTab("desc")}
          className={`pb-2 text-lg font-medium transition ${
            activeTab === "desc"
              ? "border-b-2 border-green-600 text-white !bg-green-600"
              : "text-gray-500 hover:text-green-600"
          }`}
        >
          Deskripsi
        </button>

        <button
          onClick={() => setActiveTab("update")}
          className={`pb-2 text-lg font-medium transition ${
            activeTab === "update"
              ? "border-b-2 border-green-600 text-white !bg-green-600"
              : "text-gray-500 hover:text-green-600"
          }`}
        >
          Update
        </button>
      </div>

      {/* Content */}
      {activeTab === "desc" ? (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-gray-800 my-4">
            Tentang Program
          </h3>

          <div className="bg-[#f7fcf7] rounded-xl shadow-lg shadow-green-100/30 border border-green-50 p-6">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {getTags().map((tag, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Deskripsi dari file .txt */}
            {deskripsiHtml ? (
              <div dangerouslySetInnerHTML={{ __html: deskripsiHtml }} />
            ) : (
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Program{" "}
                  <span className="font-semibold text-green-600">
                    {campaignData.judul}
                  </span>{" "}
                  merupakan inisiatif komprehensif yang bertujuan untuk
                  mempercepat proses penanaman pohon di wilayah{" "}
                  {campaignData.lokasi}. Melalui kolaborasi strategis dengan
                  masyarakat lokal, pemerintah daerah, dan organisasi
                  lingkungan, kami menciptakan ekosistem berkelanjutan yang
                  tidak hanya menanam pohon tetapi juga memberdayakan komunitas.
                </p>

                <div className="my-6 rounded-xl overflow-hidden border border-gray-200 shadow-md">
                  <img
                    src={
                      campaignData.poster_url ||
                      "https://i.pinimg.com/736x/4c/df/85/4cdf85a2453a742b76bbd808e9d97b67.jpg"
                    }
                    alt={`Program ${campaignData.judul}`}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 text-center">
                      Program penanaman {campaignData.jenis_pohon} di{" "}
                      {campaignData.lokasi}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Setiap donasi yang terkumpul akan dialokasikan secara
                  transparan untuk tiga pilar utama:{" "}
                  <span className="font-medium text-green-600">
                    penyediaan bibit berkualitas tinggi
                  </span>
                  ,{" "}
                  <span className="font-medium text-green-600">
                    program perawatan intensif
                  </span>
                  , dan{" "}
                  <span className="font-medium text-green-600">
                    sistem monitoring digital
                  </span>{" "}
                  yang memantau perkembangan pohon melalui teknologi satellite
                  imaging dan laporan lapangan rutin.
                </p>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-3">
                    <span className="bg-green-50 text-green-800 px-3 py-2 rounded-lg text-sm font-medium border border-green-200">
                      🌿 Reboisasi Berkelanjutan
                    </span>
                    <span className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium border border-blue-200">
                      🤝 Pemberdayaan Masyarakat
                    </span>
                    <span className="bg-purple-50 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium border border-purple-200">
                      📊 Monitoring Digital
                    </span>
                    <span className="bg-orange-50 text-orange-800 px-3 py-2 rounded-lg text-sm font-medium border border-orange-200">
                      🌍 Dampak Jangka Panjang
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 w-full max-w-2xl">
          {!updates || updates.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-500">
                Belum ada update untuk kampanye ini.
              </p>
            </div>
          ) : (
            updates
              .sort(
                (a, b) =>
                  new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
              )
              .map((update, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg shadow-green-100/50 border border-green-50 p-4 hover:shadow-green-200/50 transition-all duration-300"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">
                        <i className="bx bxs-bell"></i>
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-emerald-600 font-medium">
                        📅 {formatDate(update.tanggal)}
                      </p>
                      <p className="text-gray-800 mt-1 leading-relaxed font-semibold">
                        {update.judul}
                      </p>
                      {update.image_url && (
                        <Image
                          src={update.image_url}
                          alt={update.judul}
                          width={300}
                          height={300}
                          className="mt-2 rounded-lg object-cover"
                        />
                      )}
                      <div
                        className="text-gray-600 mt-1 text-sm prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: update.deskripsi }}
                      />

                      <p className="text-xs text-gray-400 mt-2">
                        Diposting oleh: {update.author}
                      </p>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
}
