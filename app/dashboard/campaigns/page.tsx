"use client"

import DonationCard from "@/components/DonationCard";
import Image from "next/image";
import Link from "next/link";
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
            mitra: "Green Earth Foundation",
            date: "2025-11-28",
            description: "Kami telah berhasil menanam 5.000 bibit di area yang ditentukan. Terima kasih kepada semua donatur atas dukungan Anda! Masyarakat setempat sangat membantu dalam membersihkan lahan dan menyiapkan tanah.",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
            medan: "hutan",
            location: "Borneo",
            current: 240210,
            target: 500000,
            progress: 49,
            deadline: "6 hari lagi",
        },
        {
            id: 2,
            campaign: "Urban Green Jakarta",
            mitra: "EcoWarriors Jakarta",
            date: "2025-11-20",
            description: "Tim kami saat ini sedang berada di lokasi mempersiapkan untuk acara penanaman yang akan datang minggu depan. Kami membersihkan sampah dan menandai tempat untuk pohon baru.",
            image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&q=80&w=800",
            medan: "perkotaan",
            location: "Borneo",
            current: 147783,
            target: 600000,
            progress: 23,
            deadline: "2 Minggu lagi",
        },
        {
            id: 3,
            campaign: "Selamatkan Hutan Sumatra",
            mitra: "Wildlife Protection",
            date: "2025-11-15",
            description: "Kami senang mengumumkan sebuah kerjasama baru dengan departemen hutan setempat untuk memperluas area konservasi. Ini akan memungkinkan kami untuk menanam 2.000 pohon tambahan setiap tahun.",
            image: "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            medan: "hutan",
            location: "Borneo",
            current: 21023,
            target: 100000,
            progress: 21,
            deadline: "1 Bulan lagi",
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
                className="md:w-full w-[15px] bg-leaf-600 hover:bg-leaf-700 text-white py-3 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 !m-0"
              >
                <p className="md:inline! hidden">Terapkan</p> <i className="bx bx-search flex md:hidden!"></i>
              </button>
              </div>
          </div>
        <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:items-center ">
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
                    <Link
                    href={`/dashboard/campaigns/${update.id}`}
                    key={update.id}
                    >
                      <DonationCard 
                      image={update.image}
                      title={update.campaign}
                      mitra={update.mitra}
                      medan={update.medan}
                      location={update.location}
                      description={update.description}
                      current={update.current}
                      target={update.target}
                      progress={update.progress}
                      deadline={update.deadline}
                      />
                    </Link>
                ))}
          </div>
      </div>
    );
}
