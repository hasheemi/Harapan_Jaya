"use client";

import React, { useState } from "react";

export default function TabSection() {
  const [activeTab, setActiveTab] = useState<"desc" | "update">("desc");

  return (
    <div className="px-6 sm:px-12 text-black">
      <h2 className="text-3xl md:text-4xl font-bold leading-tight text-black mb-6 w-4/5">
        Laju Reboisasi Memberi Angin Segar bagi Masa Depan
      </h2>

      {/* Tabs */}
      <div className="flex  space-x-4 border-b border-gray-300 mb-4">
        <button
          onClick={() => setActiveTab("desc")}
          className={`pb-2 text-lg font-medium transition ${activeTab === "desc"
              ? "border-b-2 border-green-600 text-green-700"
              : "text-gray-500 hover:text-green-600"
            }`}
        >
          Deskripsi
        </button>

        <button
          onClick={() => setActiveTab("update")}
          className={`pb-2 text-lg font-medium transition ${activeTab === "update"
              ? "border-b-2 border-green-600 text-green-700"
              : "text-black-500 hover:text-green-600"
            }`}
        >
          Update
        </button>
      </div>

      {/* Content */}
      {activeTab === "desc" ? (
        <div className="space-y-6 text-black">
          <h3 className="text-2xl font-semibold text-gray-800 my-4">
            Tentang Program
          </h3>

          <div className="bg-[#f7fcf7] rounded-xl shadow-lg shadow-green-100/30 border border-green-50 p-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              Program{" "}
              <span className="font-semibold text-green-600">
                "Hijaukan Kembali"
              </span>{" "}
              merupakan inisiatif komprehensif yang bertujuan untuk mempercepat
              proses reboisasi di wilayah-wilayah terdampak deforestasi parah di
              Indonesia. Melalui kolaborasi strategis dengan masyarakat lokal,
              pemerintah daerah, dan organisasi lingkungan, kami menciptakan
              ekosistem berkelanjutan yang tidak hanya menanam pohon tetapi juga
              memberdayakan komunitas.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                🌱 Kabupaten Sorong
              </span>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                🏞️ Hutan Mangrove
              </span>
              <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                ⏳ Program 5 Tahun
              </span>
            </div>

            <div className="my-6 rounded-xl overflow-hidden border border-gray-200 shadow-md">
              <img
                src="https://i.pinimg.com/736x/4c/df/85/4cdf85a2453a742b76bbd808e9d97b67.jpg"
                alt="Proses Penanaman Mangrove oleh Masyarakat Lokal"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                <p className="text-sm text-gray-600 text-center">
                  Proses penanaman bibit mangrove oleh relawan dan masyarakat
                  lokal di pesisir Kabupaten Sorong
                </p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              Setiap donasi yang terkumpul akan dialokasikan secara transparan
              untuk tiga pilar utama:{" "}
              <span className="font-medium text-green-600">
                penyediaan bibit berkualitas tinggi
              </span>
              ,{" "}
              <span className="font-medium text-green-600">
                program perawatan intensif selama 3 tahun
              </span>
              , dan{" "}
              <span className="font-medium text-green-600">
                sistem monitoring digital
              </span>{" "}
              yang memantau perkembangan pohon melalui teknologi satellite
              imaging dan laporan lapangan rutin.
            </p>

            <p className="text-gray-700 leading-relaxed mb-4">
              Kami telah membangun pusat pembibitan lokal yang melibatkan lebih
              dari 50 keluarga di sekitar area penanaman. Tidak hanya memberikan
              dampak lingkungan, program ini juga menciptakan lapangan pekerjaan
              berkelanjutan bagi masyarakat. Setiap bibit yang ditanam akan
              melalui proses seleksi ketat untuk memastikan adaptasi dengan
              kondisi tanah dan iklim setempat.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Dalam 5 tahun ke depan, target kami adalah memulihkan{" "}
              <span className="font-semibold">500 hektar</span> lahan kritis,
              menanam lebih dari{" "}
              <span className="font-semibold">100,000 pohon</span>, dan
              melibatkan <span className="font-semibold">1,000 keluarga</span>{" "}
              dalam program pemberdayaan. Setiap donor akan menerima laporan
              perkembangan berkala dan sertifikat partisipasi digital yang dapat
              dilacak melalui platform kami.
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
        </div>
      ) : (
        <div className="space-y-4 w-full max-w-2xl ">
          <div className="bg-white rounded-xl shadow-lg shadow-green-100/50 border border-green-50 p-4 hover:shadow-green-200/50 transition-all duration-300">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🌱</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-emerald-600 font-medium">
                  📅 2 November 2025
                </p>
                <p className="text-gray-800 mt-1 leading-relaxed">
                  Penanaman tahap pertama dilakukan di Kabupaten Sorong.
                </p>
                <div className="mt-3 rounded-lg overflow-hidden border border-gray-100">
                  <img
                    src="https://i.pinimg.com/736x/4c/df/85/4cdf85a2453a742b76bbd808e9d97b67.jpg"
                    alt="Penanaman di Sorong"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg shadow-green-100/50 border border-green-50 p-4 hover:shadow-green-200/50 transition-all duration-300">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">💰</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-cyan-600 font-medium">
                  📅 1 Oktober 2025
                </p>
                <p className="text-gray-800 mt-1 leading-relaxed">
                  Pengumpulan donasi mencapai 80% dari target.
                </p>
                <div className="mt-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Progress Donasi
                    </span>
                    <span className="text-sm font-bold text-emerald-600">
                      80%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg shadow-green-100/50 border border-green-50 p-4 hover:shadow-green-200/50 transition-all duration-300">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🚀</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-indigo-600 font-medium">
                  📅 15 September 2025
                </p>
                <p className="text-gray-800 mt-1 leading-relaxed">
                  Kampanye "Hijaukan Kembali" resmi dimulai.
                </p>
                <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    #HijaukanKembali
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                    #GoGreen
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
