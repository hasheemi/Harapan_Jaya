"use client";

import { useState, useEffect } from "react";
import Root from "@/app/dashboard/components/Root";
import DonationCard from "@/components/DonationCard";

let userName = "Ridwan";

export default function Campaign() {
  const [sort, setSort] = useState<"terbaru" | "terdekat">("terbaru");
  const [medan, setMedan] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [mitra, setMitra] = useState("");

  const handleApply = () => {
    console.log({
      sort,
      medan,
      lokasi,
      mitra,
    });
  };

  useEffect(() => {
    // Initialize AOS
    if (typeof window !== "undefined") {
      const AOS = require("aos");
      AOS.init({
        duration: 1000,
        once: true,
      });
    }
  }, []);

  return (
    <Root show={true}>
      <div className="top-0 w-full space-y-4 fixed bg-leaf-50 z-50 p-4 shadow-sm">
        <div className="w-full p-4 flex justify-between">
          <div>
            <h3 className="text-3xl text-black"> Halo {userName}</h3>
            <p className="font-bold"> Kelola Campaign Yayasanmu </p>
          </div>
          <a href="/dashboard/admin/campaign/create" className="flex justify-center items-center bg-leaf-600 hover:bg-leaf-700 text-white w-32 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 !m-0">Buat Campaign</a>
        </div>
        <div className="w-full space-y-4">
          {/* 🔍 Search + Sort + Filter */}
          <div className="search flex flex-row justify-start w-full items-center gap-3 px-6 sm:px-12 mx-auto py-3 bg-leaf-50 rounded-xl shadow-sm">
            {/* Search Input */}
            <div className="w-[60%] border border-leaf-500 rounded-lg relative">
              <input
                type="text"
                placeholder="Cari program donasi terbaru..."
                className="bg-white border-none rounded-lg px-4 py-3 text-sm w-full focus:ring-2 focus:ring-leaf-400"
              />
              <i className="bx bx-search absolute right-3 top-2.5 text-leaf-900 text-xl"></i>
            </div>
            {/* Sort & Filter Buttons */}
            <div className="flex flex-row gap-4 justify-end">
              {/* Urutkan */}
              <div
                onClick={() =>
                  setSort((prev) =>
                    prev === "terdekat" ? "terbaru" : "terdekat"
                  )
                }
                className="chips flex items-center gap-2 bg-leaf-500 hover:bg-leaf-600 text-white px-5 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 shadow-sm"
              >
                <i className="bx bx-sort text-base"></i>
                <span>
                  Urutkan: {sort === "terdekat" ? "Terdekat" : "Terbaru"}
                </span>
              </div>
              {/* Filter */}
              <div className="chips flex items-center gap-2 bg-leaf-500 hover:bg-leaf-600 text-white px-5 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 shadow-sm">
                <i className="bx bx-filter-alt text-base"></i>
                <span>Filter</span>
              </div>
            </div>
          </div>
          {/* 🧭 Dropdown Filter Section */}
          <div className="flex flex-row flex-wrap items-center gap-3 px-6 sm:px-12">
            {/* Medan */}
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
            {/* Lokasi */}
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
            {/* Terapkan Button */}
            <button
              onClick={handleApply}
              className="bg-leaf-600 hover:bg-leaf-700 text-white w-32 py-3 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 !m-0"
            >
              Terapkan
            </button>
          </div>
        </div>
      </div>
        <section className="donation px-6 sm:px-12 mt-60 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-12 mt-10 mx-auto justify-between">
            {donationCards.map((card, index) => (
              <DonationCard key={index} {...card} />
            ))}
          </div>
        </section>
    </Root>
  );
}

const donationCards = [
  {
    image: "/assets/img/item/sinarmas.jpeg",
    title: "Sinarmas",
    description: "Menanam kembali kertas menjadi pohon bersama PT. Sinarmas",
    current: "240,210 Bibit",
    target: "500,000 Bibit",
    progress: 49,
    deadline: "6 hari lagi",
  },
  {
    image: "/assets/img/item/ikn.jpg",
    title: "Sinarmas",
    description: "Revitalisasi Hutan di Kalimantan akibat proyek strategis",
    current: "147,783 Bibit",
    target: "600,000 Bibit",
    progress: 23,
    deadline: "2 Minggu lagi",
  },
  {
    image: "/assets/img/item/gemarsorong.jpg",
    title: "Sinarmas",
    description: "Reboisasi Mangrove pencegah abrasi di Sorong Papua",
    current: "21,023 Bibit",
    target: "100,000 Bibit",
    progress: 21,
    deadline: "1 Bulan lagi",
  },
];