// app/about/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Jumbotron from "@/components/Jumbotron";
import Footer from "@/components/Footer";
import DonationCard from "@/components/DonationCard";

export default function Campaign() {
  const [sort, setSort] = useState<"terdekat" | "terbaru">("terdekat");
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
    <div className="!overflow-x-hidden bg-leaf-50">
      <Navbar />
      <Jumbotron
        imageUrl="/assets/img/background/campaign_background.jpeg"
        title="Donasi Bibit Pohon Resapling"
      />
      <div className="w-full space-y-4">
        {/* 🔍 Search + Sort + Filter */}
        <div className="search flex flex-col md:flex-row justify-between w-full items-center gap-3 px-6 sm:px-12 mx-auto py-3 bg-leaf-50 rounded-xl shadow-sm">
          {/* Search Input */}
          <div className="w-full md:w-[60%] border border-leaf-500 rounded-lg relative">
            <input
              type="text"
              placeholder="Cari program donasi terbaru..."
              className="bg-white border-none rounded-lg px-4 py-3 text-sm w-full focus:ring-2 focus:ring-leaf-400"
            />
            <i className="bx bx-search absolute right-3 top-2.5 text-leaf-900 text-xl"></i>
          </div>

          {/* Sort & Filter Buttons */}
          <div className="flex flex-row gap-4 w-full md:w-2/5 justify-end">
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

          {/* Mitra */}
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

          {/* Terapkan Button */}
          <button
            onClick={handleApply}
            className="bg-leaf-600 hover:bg-leaf-700 text-white px-8 py-3 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 !m-0"
          >
            Terapkan
          </button>
        </div>
      </div>
      <section className="donation  px-6 sm:px-12 mt-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-12 mt-10 mx-auto justify-between">
          {donationCards.map((card, index) => (
            <Link href={`/campaign/charity`}>
              <DonationCard key={index} {...card} />
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

const donationCards = [
  {
    image: "/assets/img/item/sinarmas.jpeg",
    title: "Sinarmas",
    description: "Menanam kembali kertas menjadi pohon bersama PT. Sinarmas",
    current: 240210,
    target: 500000,
    progress: 49,
    deadline: "6 hari lagi",
  },
  {
    image: "/assets/img/item/ikn.jpg",
    title: "Otorita IKA-EN",
    description: "Revitalisasi Hutan di Kalimantan akibat proyek strategis",
    current: 147783,
    target: 600000,
    progress: 23,
    deadline: "2 Minggu lagi",
  },
  {
    image: "/assets/img/item/gemarsorong.jpg",
    title: "Hulujaya",
    description: "Reboisasi Mangrove pencegah abrasi di Sorong Papua",
    current: 21023,
    target: 100000,
    progress: 21,
    deadline: "1 Bulan lagi",
  },
];
