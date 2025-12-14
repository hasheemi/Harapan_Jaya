// app/about/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Jumbotron from "@/components/Jumbotron";
import Footer from "@/components/Footer";
import DonationCard from "@/components/DonationCard";


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
  tanggal_selesai: any;
  nama_yayasan?: string; // Tambahkan field ini jika ada di data
  created_at: Date | null;
  updated_at: Date | null;
}

interface DonationCardData {
  image: string;
  title: string;
  description: string;
  current: number;
  target: number;
  progress: number;
  deadline: string;
  nama_yayasan?: string;
  lokasi?: string;
}

export default function Campaign() {
  const [sort, setSort] = useState<"terdekat" | "terbaru">("terdekat");
  const [medan, setMedan] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [mitra, setMitra] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch campaigns dari Firebase tanpa filter email
  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        const campaignsRef = collection(db, "campaignsv2");
        const querySnapshot = await getDocs(campaignsRef);

        const campaignsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          // Calculate financial values
          const targetDonasi = data.target_donasi || 0;
          const totalPohon = data.total_pohon || 0;
          const totalDonasi = data.total_donasi || 0;

          return {
            // Document ID untuk linking
            id: doc.id,

            // Campaign data dari schema
            campaignId: data.id,
            judul: data.judul || "Untitled Campaign",
            status: data.status || "draft",
            target_donasi: targetDonasi,
            total_donasi: totalDonasi,
            total_pohon: totalPohon,
            total_donatur: data.total_donatur || 0,
            progress_percentage: data.progress_percentage || 0,
            tanggal_mulai: data.tanggal_mulai?.toDate?.() || null,
            tanggal_selesai: data.tanggal_berakhir?.toDate?.() || null,

            // Calculated values untuk display
            raised:  totalPohon ,
            target: targetDonasi ,
            trees: totalPohon,

            // Field lainnya
            poster_url: data.poster_url || "",
            lokasi: data.lokasi || "",
            jenis_pohon: data.jenis_pohon || "",
            nama_yayasan: data.created_by_yayasan || data.created_by_name || "", // Ambil nama yayasan jika ada
            created_at: data.created_at?.toDate?.() || null,
            updated_at: data.updated_at?.toDate?.() || null,
            medan: data.medan || "",

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

  // Konversi data campaign ke format DonationCard
  const donationCards: DonationCardData[] = campaigns.map((campaign) => {
    // Format judul untuk title (ambil 2-3 kata pertama jika terlalu panjang)
    const titleWords = campaign.judul.split(" ");
    const shortTitle =
      titleWords.length > 3
        ? `${titleWords.slice(0, 3).join(" ")}...`
        : campaign.judul;

    // Buat deskripsi dari kombinasi judul dan lokasi
    const description = `${campaign.judul}`;

    // Hitung progress percentage
    const progress =
      campaign.target > 0
        ? Math.round((campaign.raised / campaign.target) * 100)
        : 0;

    // Generate deadline dummy (atau gunakan data dari firebase jika ada)
    let deadline= "Telah Berakhir";
    if (campaign.tanggal_selesai) {
      const endDate = campaign.tanggal_selesai.toDate();
      const today = new Date();
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        deadline = `${diffDays} hari lagi`;
      }
    }

    return {
      image: campaign.poster_url || "/assets/img/item/gemarsorong.jpg",
      title: campaign.nama_yayasan || shortTitle,
      description: description,
      current: campaign.raised,
      target: campaign.target,
      progress: Math.min(progress, 100), // Maksimal 100%
      deadline: deadline,
      nama_yayasan: campaign.nama_yayasan,
      lokasi: campaign.lokasi,
      jenis_pohon: campaign.jenis_pohon,
      medan: campaign.medan,
    };
  });

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

  // Loading state
  if (isLoading) {
    return (
      <div className="!overflow-x-hidden bg-leaf-50 min-h-screen">
        <Navbar />
        <Jumbotron
          imageUrl="/assets/img/background/campaign_background.jpeg"
          title="Donasi Bibit Pohon Resapling"
        />
        <div className="flex justify-center items-center h-64">
          <div className="text-leaf-700">Memuat kampanye...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="!overflow-x-hidden bg-leaf-50">
      <Navbar />
      <Jumbotron
        imageUrl="/assets/img/background/campaign_background.jpeg"
        title="Donasi Bibit Pohon Resapling"
      />
      <div className="w-full space-y-4">
        {/* Search + Sort + Filter */}
        <div className="search flex flex-col md:flex-row justify-between w-full items-center gap-3 px-6 sm:px-12 mx-auto py-3 bg-leaf-50 rounded-xl shadow-sm">
          {/* Search Input */}
          <div className="w-full md:w-[60%] border border-leaf-500 rounded-lg relative">
            <input
              type="text"
              placeholder="Cari program donasi terbaru..."
              className="bg-white border-none rounded-lg px-4 py-3 text-sm w-full focus:ring-2 focus:ring-leaf-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Dropdown Filter Section */}
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
      <section className="donation px-6 sm:px-12 mt-4 pb-20">
        {donationCards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-leaf-700">
              Tidak ada kampanye donasi yang tersedia.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-12 mt-10 mx-auto justify-between">
            {donationCards.map((card, index) => (
              <Link
                href={`/campaign/${campaigns[index]?.campaignId || "detail"}`}
                key={campaigns[index]?.campaignId || index}
              >
                <DonationCard
                  image={card.image}
                  title={card.title}
                  description={card.description}
                  current={card.current}
                  target={card.target}
                  progress={card.progress}
                  deadline={card.deadline}
                  location={card.lokasi}
                  medan={card.medan}
                />
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}



