"use client"

import Image from "next/image";
import { useState } from "react";

export default function CampaignUpdatesPage() {
    // State
    const [sort, setSort] = useState<"terdekat" | "terbaru">("terdekat");
    const [medan, setMedan] = useState("");
    const [lokasi, setLokasi] = useState("");
    const [mitra, setMitra] = useState("");
    // Mock Updates Data
    const updates = [
        {
            id: 1,
            campaign: "Reforest Borneo",
            organizer: "Green Earth Foundation",
            date: "2025-11-28",
            title: "Phase 1 Planting Complete!",
            content: "Kami telah berhasil menanam 5.000 bibit di area yang ditentukan. Terima kasih kepada semua donatur atas dukungan Anda! Masyarakat setempat sangat membantu dalam membersihkan lahan dan menyiapkan tanah.",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
            tags: ["Milestone", "Planting"],
        },
        {
            id: 2,
            campaign: "Urban Green Jakarta",
            organizer: "EcoWarriors Jakarta",
            date: "2025-11-20",
            title: "Site Preparation Underway",
            content: "Tim kami saat ini sedang berada di lokasi mempersiapkan untuk acara penanaman yang akan datang minggu depan. Kami membersihkan sampah dan menandai tempat untuk pohon baru.",
            image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&q=80&w=800",
            tags: ["Preparation"],
        },
        {
            id: 3,
            campaign: "Selamatkan Hutan Sumatra",
            organizer: "Wildlife Protection",
            date: "2025-11-15",
            title: "New Partnership Announced",
            content: "Kami senang mengumumkan sebuah kerjasama baru dengan departemen hutan setempat untuk memperluas area konservasi. Ini akan memungkinkan kami untuk menanam 2.000 pohon tambahan setiap tahun.",
            image: "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            tags: ["Partnership", "Expansion"],
        },
    ];

    return (
        <div className="space-y-6 w-full">
            {/* FIlter */}
          <div className=" w-full text-black">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Kampanye </h1>
                <p className="text-gray-500">Jadilah Pahlawan Hijau hari ini</p>
              </div>
              <div className="flex items-center gap-4 w-full my-4">
                        <label className="input w-full bg-white border-2 border-leaf-500 rounded-2xl">
                          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none"
                              stroke="black">
                              <circle cx="11" cy="11" r="8"></circle>
                              <path d="m21 21-4.3-4.3"></path>
                            </g>
                          </svg>
                          <input type="search" required placeholder="Search" />
                        </label>
              <div className="flex gap-4">
                <button
                className="bg-leaf-600 hover:bg-leaf-700 text-white py-3 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 !m-0"
              >
                Terapkan
              </button>
              </div>
          </div>
        <div className="flex flex-wrap items-center gap-3">
              <select
                value={medan}
                onChange={(e) => setMedan(e.target.value)}
                className="border border-leaf-400 rounded-lg px-6 py-3 text-sm text-leaf-950 bg-white focus:ring-2 focus:ring-leaf-500"
              >
                <option value="">Pilih Medan</option>
                <option value="hutan">Hutan</option>
                <option value="pesisir">Pesisir</option>
                <option value="perkotaan">Perkotaan</option>
                <option value="lahan_kritis">Lahan Kritis</option>
              </select>
              <select
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="border border-leaf-400 rounded-lg px-6 py-3 text-sm text-leaf-950 bg-white focus:ring-2 focus:ring-leaf-500"
              >
                <option value="">Pilih Lokasi</option>
                <option value="jawa">Jawa</option>
                <option value="kalimantan">Kalimantan</option>
                <option value="sumatera">Sumatera</option>
                <option value="sulawesi">Sulawesi</option>
                <option value="papua">Papua</option>
                <option value="bali">Bali & Nusa Tenggara</option>
              </select>
              <select
                value={mitra}
                onChange={(e) => setMitra(e.target.value)}
                className="border border-leaf-400 rounded-lg px-6 py-3 text-sm text-leaf-950 bg-white focus:ring-2 focus:ring-leaf-500"
              >
                <option value="">Pilih Mitra</option>
                <option value="pemerintah">Pemerintah</option>
                <option value="swasta">Swasta</option>
                <option value="internasional">Internasional</option>
                <option value="komunitas">Komunitas Lokal</option>
              </select>
              <div
                  onClick={() =>
                    setSort((prev) =>
                      prev === "terdekat" ? "terbaru" : "terdekat"
                    )
                  }
                  className="chips flex items-center gap-2 bg-leaf-500 hover:bg-leaf-600 text-white px-5 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 shadow-sm whitespace-nowrap"
                  >
                  <i className="bx bx-sort text-base"></i>
                  <span>
                    Urutkan: {sort === "terdekat" ? "Terdekat" : "Terbaru"}
                  </span>
                </div>
            </div>
        </div>


        {/* Filter End */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {updates.map((update) => (
                    <div key={update.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative h-48 w-full">
                            <Image
                                src={update.image}
                                alt={update.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-leaf-700 rounded-full">
                                    {update.campaign}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                                <i className="bx bx-calendar"></i>
                                <span>{update.date}</span>
                                <span className="mx-1">•</span>
                                <span>{update.organizer}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{update.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{update.content}</p>
                            <div className="flex flex-wrap gap-2">
                                {update.tags.map((tag) => (
                                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
          </div>
      </div>
    );
}
