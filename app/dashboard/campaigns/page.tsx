"use client";

import DonationCard from "@/components/DonationCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
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

export default function CampaignUpdatesPage() {
  // State
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
            tanggal_berakhir: data.tanggal_berakhir?.toDate?.() || null,

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
    if (campaign.tanggal_berakhir) {
      const endDate = campaign.tanggal_berakhir.toDate();
      const today = new Date();
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        deadline = `${diffDays} hari lagi`;
      }
    }

    console.log(campaign)

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
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="black"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input type="search" required placeholder="Search" />
          </label>
          <div className="flex gap-4">
            <button className="md:w-full w-[15px] bg-leaf-600 hover:bg-leaf-700 text-white py-3 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 !m-0">
              <p className="md:inline! hidden">Terapkan</p>{" "}
              <i className="bx bx-search flex md:hidden!"></i>
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
              setSort((prev) => (prev === "terdekat" ? "terbaru" : "terdekat"))
            }
            className="chips flex items-center gap-2 bg-leaf-500 hover:bg-leaf-600 text-white px-5 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 shadow-sm whitespace-nowrap"
          >
            <i className="bx bx-sort text-base"></i>
            <span>Urutkan: {sort === "terdekat" ? "Terdekat" : "Terbaru"}</span>
          </div>
        </div>
      </div>

      {/* Filter End */}
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
    </div>
  );
}
