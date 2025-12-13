"use client";
import Footer from "@/components/Footer";
import Jumbotron from "@/components/Jumbotron";
import Navbar from "@/components/Navbar";
import TabSection from "./TabSection";
import Modal from "@/components/Modal";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ToastContainer, toast } from "react-toastify";

interface CampaignData {
  id: string;
  judul: string;
  status: string;
  target_donasi: number;
  total_donasi: number;
  total_pohon: number;
  total_donatur: number;
  progress_percentage: number;
  poster_url: string;
  lokasi: string;
  jenis_pohon: string;
  created_by: string;
  created_by_yayasan: string;
  deskripsi_url: string;
  medan: string;
  tanggal_berakhir: string;
  tanggal_mulai: string;
  tanggal_planning: string;
  created_at: Date | null;
  updated_at: Date | null;
  updates: any[];
}

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const [activeModal, setActiveModal] = useState<"donasi" | "bagikan" | null>(
    null
  );
  const [jumlahPohon, setJumlahPohon] = useState<number>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false);
  const [localData, setLocalData] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deskripsiHtml, setDeskripsiHtml] = useState<string>("");
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [recentDonations, setRecentDonations] = useState<any[]>([]);
  const [updatesList, setUpdatesList] = useState<any[]>([]);

  // Ambil data user dari localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setLocalData(JSON.parse(stored));
      }
    } catch (err) {
      console.warn("LocalStorage parse failed:", err);
    } finally {
      setIsAuthReady(true);
    }
  }, []);



  const fetchDeskripsi = async (deskripsiUrl: string) => {
    try {
      const response = await fetch(deskripsiUrl);
      if (response.ok) {
        const text = await response.text();

        // Jangan escape HTML karena sudah di-handle oleh BE
        // Langsung proses formatting saja
        const htmlContent = text
          .split("\n")
          .filter((line) => line.trim() !== "")
          .map(
            (line) =>
              `<p class="text-gray-700 leading-relaxed mb-4">${line}</p>`
          )
          .join("");

        setDeskripsiHtml(htmlContent);
      } else {
        setDeskripsiHtml("<p>Deskripsi tidak tersedia.</p>");
      }
    } catch (error) {
      console.error("Error fetching description:", error);
      setDeskripsiHtml("<p>Gagal memuat deskripsi.</p>");
    }
  };

  // Ambil data campaign dari Firestore berdasarkan ID
  useEffect(() => {
    const fetchCampaignData = async () => {
      setIsLoading(true);
      try {
        const { id } = await params;

        if (!id) {
          console.error("ID campaign tidak ditemukan");
          setIsLoading(false);
          return;
        }

        // Query Firestore dengan where pada field "id" (bukan doc.id)
        const campaignsRef = collection(db, "campaignsv2");
        const q = query(campaignsRef, where("id", "==", id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.error("Campaign tidak ditemukan");
          setCampaignData(null);
        } else {
          const doc = querySnapshot.docs[0];
          const data = doc.data();

          try {
            const updatesRef = collection(db, "updatesv2");
            console.log("Fetching updates for campaign ID:", id);
            const qUpdates = query(
              updatesRef,
              where("campaign_id", "==", id)
              // orderBy("created_at", "desc") // masalah index
            );
            const updatesSnapshot = await getDocs(qUpdates);
            console.log("Updates found:", updatesSnapshot.size);
            const fetchedUpdates = updatesSnapshot.docs.map((uDoc) => ({
              id: uDoc.id,
              ...uDoc.data(),
            }));
            setUpdatesList(fetchedUpdates);
          } catch (err) {
            console.error("Error fetching updates:", err);
          }

          const campaign: CampaignData = {
            id: data.id,
            judul: data.judul || "Untitled Campaign",
            status: data.status || "draft",
            target_donasi: data.target_donasi || 0,
            total_donasi: data.total_donasi || 0,
            total_pohon: data.total_pohon || 0,
            total_donatur: data.total_donatur || 0,
            progress_percentage: data.progress_percentage || 0,
            poster_url: data.poster_url || "",
            lokasi: data.lokasi || "",
            jenis_pohon: data.jenis_pohon || "",
            created_by: data.created_by || "",
            created_by_yayasan: data.created_by_yayasan || "",
            deskripsi_url: data.deskripsi_url || "",
            medan: data.medan || "",
            tanggal_berakhir: data.tanggal_berakhir || "",
            tanggal_mulai: data.tanggal_mulai || "",
            tanggal_planning: data.tanggal_planning || "",
            created_at: data.created_at?.toDate?.() || null,
            updated_at: data.updated_at?.toDate?.() || null,
            updates: data.updates || [],
          };

          setCampaignData(campaign);

          // Hitung hari tersisa
          if (data.tanggal_berakhir) {
            const endDate = new Date(data.tanggal_berakhir);
            const today = new Date();
            const diffTime = endDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysLeft(Math.max(0, diffDays));
          }

          // Ambil deskripsi dari URL .txt
          if (data.deskripsi_url) {
            await fetchDeskripsi(data.deskripsi_url);
          }
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
        setCampaignData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignData();
  }, [params]);

  useEffect(() => {
    const fetchRecentDonations = async () => {
      console.log(campaignData?.id);
      if (!campaignData?.id) return;

      try {
        const transactionsRef = collection(db, "transactionsv2");
        const q = query(
          transactionsRef,
          where("campaign_id", "==", campaignData.id),
          orderBy("created_at", "desc"),
          limit(4)
        );

        const querySnapshot = await getDocs(q);
        const donations: any[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          donations.push({
            id: doc.id,
            ...data,
            created_at: data.created_at?.toDate?.() || null,
          });
        });

        setRecentDonations(donations);
      } catch (error) {
        console.error("Error fetching recent donations:", error);
      }
    };

    if (campaignData?.id) {
      fetchRecentDonations();
    }
  }, [campaignData?.id]);


  // Format tanggal relatif
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 604800)} minggu yang lalu`;

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleDonasiClick = () => {
    setActiveModal("donasi");
  };

  const handleBagikanClick = () => {
    setActiveModal("bagikan");
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setJumlahPohon(1);
    setSelectedFile(null);
    setIsLinkCopied(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCopyLink = () => {
    if (campaignData) {
      navigator.clipboard.writeText(window.location.href);
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    }
  };

  const handleSubmitDonasi = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submit donasi dipanggil");
    console.log("Campaign Data:", campaignData);
    console.log("Local Data:", localData);

    try {
      if (!campaignData) {
        toast.error("Campaign tidak ditemukan", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
      if (jumlahPohon < 1) {
        toast.error("Jumlah pohon harus lebih dari 0", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      const totalDonasi = jumlahPohon * 15000;

      // Data untuk API - PASTIKAN INI BENER
      const donationData = {
        jumlah_pohon: jumlahPohon,
        total_donasi: totalDonasi,
        user_email: localData?.email || "anonim@example.com",
        user_name: localData?.name || "Donatur Anonim",
        user_photo: localData?.photo || "",
        campaign_id: campaignData.id, // PERHATIAN: ini doc.id atau field id?
        campaign_title: campaignData.judul,
        campaign_yayasan: campaignData.created_by_yayasan,
        lokasi: campaignData.lokasi,
        jenis_pohon: campaignData.jenis_pohon,
        is_anonim: !localData?.email,
      };
      console.log(donationData.campaign_id);

      console.log("Data yang dikirim ke API:", donationData);

      // Panggil API route
      const response = await fetch("/api/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donationData),
      });

      console.log("Response status:", response.status);

      const result = await response.json();
      console.log("Response dari API:", result);

      if (response.ok) {
        // Update UI dengan data baru
        const newTotalDonasi = campaignData.total_donasi + totalDonasi;
        const newTotalPohon = campaignData.total_pohon + jumlahPohon;
        const newTotalDonatur = campaignData.total_donatur + 1;
        const targetDonasi = campaignData.target_donasi * 15000;
        const newProgress =
          targetDonasi > 0
            ? Math.round((newTotalDonasi / targetDonasi) * 100)
            : 0;

        setCampaignData({
          ...campaignData,
          total_donasi: newTotalDonasi,
          total_pohon: newTotalPohon,
          total_donatur: newTotalDonatur,
          progress_percentage: newProgress,
        });


        toast.success(
          `Donasi ${jumlahPohon} pohon (Rp ${totalDonasi.toLocaleString()}) berhasil!`,
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
        handleCloseModal();
      } else {
        toast.error(
          "Terjadi kesalahan saat mengirim data: " + (result.error as Error).message,
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
        throw new Error(result.error || "Gagal melakukan donasi");
      }
    } catch (error: any) {
      console.error("Error detail:", error);
      alert("Terjadi kesalahan. Silakan coba lagi atau cek console.");
    }
  };

  if (isLoading) {
    return (
      <main className="bg-leaf-50 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-leaf-700">Memuat data kampanye...</div>
        </div>
      </main>
    );
  }

  if (!campaignData) {
    return (
      <main className="bg-leaf-50 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-leaf-700">Kampanye tidak ditemukan</div>
        </div>
      </main>
    );
  }

  // Hitung progress percentage
  const targetValue = campaignData.target_donasi * 15000; // 15,000 per pohon
  const raisedValue =
    campaignData.total_donasi > 0
      ? campaignData.total_donasi
      : campaignData.total_pohon * 15000;
  const progressPercentage =
    targetValue > 0 ? Math.round((raisedValue / targetValue) * 100) : 0;

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

  console.log(`Campaign Data:`, campaignData);
  console.log(`Update List:`, updatesList);

  return (
    <main className="bg-leaf-50">
      <Navbar />
      <section className="px-6 sm:px-12 flex flex-col md:flex-row w-full min-h-screen">
        <div className="left w-full md:w-[70%] pb-24">
          <Jumbotron
            imageUrl={
              campaignData.poster_url || "/assets/img/default-poster.jpg"
            }
            title=""
            height="h-[60vh] md:h-[60vh]"
            padding="!px-0"
          />
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <TabSection
            campaignData={campaignData}
            // deskripsiHtml={deskripsiHtml}
            updates={updatesList}
          />
        </div>

        <div className="right max-md:w-full w-[55%]">
          <div className="main w-[90%] mx-auto min-h-[40vh] bg-[#f7fcf7] my-4 sm:my-8 shadow-lg shadow-green-100/30 border border-green-50 rounded-lg p-6">
            {/* <!-- Progress Section --> */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                Pohon Terkumpul
              </h2>
              <div className="text-2xl font-bold text-green-700">
                {campaignData.total_pohon.toLocaleString("id-ID")} Pohon
              </div>
              <div className="text-sm text-gray-600">
                dari target {campaignData.target_donasi.toLocaleString("id-ID")}{" "}
                Pohon
              </div>

              {/* <!-- Progress Bar --> */}
              <div className="w-full bg-green-200 rounded-full h-2.5 mt-3">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              {/* <!-- Stats --> */}
              <div className="flex justify-between mt-4 text-center">
                <div>
                  <div className="text-xl font-bold text-green-700">
                    {campaignData.total_donatur.toLocaleString("id-ID")}
                  </div>
                  <div className="text-xs text-gray-600">Donatur</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-700">
                    {Math.floor(Math.random() * 50) + 10}{" "}
                    {/* Random share count */}
                  </div>
                  <div className="text-xs text-gray-600">Bagikan</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-700">
                    {daysLeft}
                  </div>
                  <div className="text-xs text-gray-600">hari lagi</div>
                </div>
              </div>
            </div>

            {/* <!-- Action Buttons --> */}
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={handleDonasiClick}
                className="flex-1 !bg-leaf-700 hover:bg-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <span>Donasi Pohon</span>
                <span>🌱</span>
              </button>
              <button
                onClick={handleBagikanClick}
                className="flex-1 bg-white border border-green-600 text-green-700 hover:bg-green-50 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <span>Bagikan</span>
                <span>🌬</span>
              </button>
            </div>

            {/* <!-- Foundation Info --> */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  {campaignData.created_by_yayasan?.charAt(0) || "H"}
                </div>
                <h3 className="font-semibold text-green-800">
                  {campaignData.created_by_yayasan || "Heka Leka Foundation"} 🌿
                </h3>
              </div>
              <button className="text-green-700 text-sm font-medium flex items-center gap-1">
                Rincian Penanaman Pohon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* <!-- Recent Donation --> */}
            {/* Recent Donation */}
            <div>
              <h3 className="font-semibold text-green-800 mb-3">
                Donasi Terbaru
              </h3>

              {recentDonations.length > 0 ? (
                <div className="space-y-3">
                  {recentDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="p-3 bg-white rounded-lg border border-green-100 shadow-sm hover:bg-green-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-base font-bold text-green-700">
                            {donation.jumlah_pohon} Pohon
                          </div>
                          <div className="text-sm text-gray-600">
                            oleh{" "}
                            {donation.is_anonim
                              ? "Donatur Anonim"
                              : donation.user_name}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {donation.created_at
                            ? formatRelativeTime(donation.created_at)
                            : "Baru saja"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-white rounded-lg border border-green-100 shadow-sm text-center">
                  <div className="text-lg font-bold text-green-700 mb-1">
                    Belum ada donasi
                  </div>
                  <div className="text-sm text-gray-600">
                    Jadilah yang pertama mendonasikan pohon!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal Donasi */}
      <Modal isOpen={activeModal === "donasi"} onClose={handleCloseModal}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
            Donasi Pohon 🌱
          </h2>

          {isAuthReady && (
            <div
              className={`text-sm p-3 rounded-lg text-center mb-6 ${localData?.email
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              {localData?.email ? (
                <>
                  Anda akan berdonasi menggunakan akun{" "}
                  <strong>{localData.email}</strong>
                </>
              ) : (
                <>
                  Anda belum login, silahkan login terlebih dahulu atau
                  berdonasi secara anonim
                </>
              )}
            </div>
          )}

          <form onSubmit={handleSubmitDonasi} className="space-y-6">
            {/* Input Jumlah Pohon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Pohon yang Didonasikan
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setJumlahPohon((prev) => Math.max(1, prev - 1))
                  }
                  className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center hover:bg-green-200 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={jumlahPohon}
                  onChange={(e) =>
                    setJumlahPohon(parseInt(e.target.value) || 1)
                  }
                  className="flex-1 text-center border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => setJumlahPohon((prev) => prev + 1)}
                  className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center hover:bg-green-200 transition-colors"
                >
                  +
                </button>
              </div>
              <div className="text-sm text-gray-600 mt-2 text-center">
                Total: Rp {(jumlahPohon * 15000).toLocaleString("id-ID")}
              </div>
            </div>

            {/* QRIS Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3 text-center">
                Scan QRIS untuk Pembayaran
              </h3>
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 flex justify-center">
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                  <img
                    src="https://d2v6npc8wmnkqk.cloudfront.net/storage/26035/conversions/Tipe-QRIS-statis-small-large.jpg"
                    alt="QRIS Code"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center mt-3">
                Gunakan aplikasi mobile banking Anda untuk scan QRIS di atas
              </p>
            </div>

            {/* Upload Bukti Pembayaran */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Bukti Pembayaran
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="bukti-pembayaran"
                />
                <label
                  htmlFor="bukti-pembayaran"
                  className="cursor-pointer block"
                >
                  <div className="text-gray-500 mb-2">
                    <i className="bx bx-cloud-upload text-3xl"></i>
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedFile
                      ? selectedFile.name
                      : "Klik untuk upload bukti pembayaran"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Format: JPG, PNG, PDF (max 5MB)
                  </p>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedFile}
              className="w-full !bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Konfirmasi Donasi {jumlahPohon} Pohon
            </button>
          </form>
        </div>
      </Modal>

      {/* Modal Bagikan */}
      <Modal isOpen={activeModal === "bagikan"} onClose={handleCloseModal}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
            Bagikan Kampanye 🌍
          </h2>

          <div className="space-y-4">
            {/* Social Media Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 p-3 !bg-blue-500 text-white rounded-lg hover:!bg-blue-600 transition-colors">
                <i className="bx bxl-facebook-circle"></i>
                Facebook
              </button>
              <button className="flex items-center justify-center gap-2 p-3 !bg-blue-400 text-white rounded-lg hover:!bg-blue-500 transition-colors">
                <i className="bx bxl-twitter"></i>
                Twitter
              </button>
              <button className="flex items-center justify-center gap-2 p-3 !bg-green-500 text-white rounded-lg hover:!bg-green-600 transition-colors">
                <i className="bx bxl-whatsapp"></i>
                WhatsApp
              </button>
              <button className="flex items-center justify-center gap-2 p-3 !bg-pink-500 text-white rounded-lg hover:!bg-pink-600 transition-colors">
                <i className="bx bxl-instagram"></i>
                Instagram
              </button>
            </div>

            {/* Copy Link Section */}
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salin Link Kampanye
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={window.location.href}
                  readOnly
                  className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${isLinkCopied
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                >
                  {isLinkCopied ? "✓ Tersalin" : "Salin"}
                </button>
              </div>
            </div>

            {/* Share Message */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 text-center">
                🌿 {campaignData.judul}. Bantu kami menanam lebih banyak pohon
                untuk masa depan yang lebih hijau! Setiap donasi berarti satu
                pohon baru untuk bumi kita.
              </p>
            </div>
          </div>
        </div>
      </Modal>

      <Footer />
    </main>
  );
}
