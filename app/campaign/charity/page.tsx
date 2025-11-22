"use client";
import Footer from "@/components/Footer";
import Jumbotron from "@/components/Jumbotron";
import Navbar from "@/components/Navbar";
import TabSection from "@/app/campaign/charity/TabSection";
import Modal from "@/components/Modal";
import { useState } from "react";

interface PageProps {
  params: { name: string };
}

export default function Page({ params }: PageProps) {
  const [activeModal, setActiveModal] = useState<"donasi" | "bagikan" | null>(
    null
  );
  const [jumlahPohon, setJumlahPohon] = useState<number>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false);

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
    if (typeof window === "undefined") return;

    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2000);
  };

  const handleSubmitDonasi = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      jumlahPohon,
      file: selectedFile,
    });
    handleCloseModal();
  };

  const { name } = params;

  return (
    <main className="bg-leaf-50">
      <Navbar />
      <section className="px-6 sm:px-12 flex flex-col md:flex-row w-full min-h-screen">
        <div className="left w-full md:w-[70%] pb-24">
          <Jumbotron
            imageUrl="/assets/img/item/gemarsorong.jpg"
            title=""
            height="h-[60vh] md:h-[60vh]"
            padding="!px-0"
          />

          <TabSection />
        </div>

        <div className="right max-md:w-full w-[55%]">
          <div className="main w-[90%] mx-auto min-h-[40vh] bg-[#f7fcf7] my-4 sm:my-8 shadow-lg shadow-green-100/30 border border-green-50 rounded-lg p-6">
            {/* <!-- Progress Section --> */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                Pohon Terkumpul
              </h2>
              <div className="text-2xl font-bold text-green-700">
                2.702 Pohon
              </div>
              <div className="text-sm text-gray-600">
                dari target 5.000 Pohon
              </div>

              {/* <!-- Progress Bar --> */}
              <div className="w-full bg-green-200 rounded-full h-2.5 mt-3">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: "54%" }}
                ></div>
              </div>

              {/* <!-- Stats --> */}
              <div className="flex justify-between mt-4 text-center">
                <div>
                  <div className="text-xl font-bold text-green-700">536</div>
                  <div className="text-xs text-gray-600">Donatur</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-700">12</div>
                  <div className="text-xs text-gray-600">Bagikan</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-700">50</div>
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
                  H
                </div>
                <h3 className="font-semibold text-green-800">
                  Heka Leka Foundation 🌿
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
            <div>
              <h3 className="font-semibold text-green-800 mb-3">
                Donasi Terbaru
              </h3>
              <div className="p-4 bg-white rounded-lg border border-green-100 shadow-sm">
                <div className="text-lg font-bold text-green-700">10 Pohon</div>
                <div className="text-sm text-gray-600 mt-1">
                  oleh PT Pelita Teknologi Bangsa • 1 hari lalu
                </div>
              </div>
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
                Total: Rp {(jumlahPohon * 100000).toLocaleString("id-ID")}
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
                    alt=""
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
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isLinkCopied
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
                🌿 Bantu kami menanam lebih banyak pohon untuk masa depan yang
                lebih hijau! Setiap donasi berarti satu pohon baru untuk bumi
                kita.
              </p>
            </div>
          </div>
        </div>
      </Modal>

      <Footer />
    </main>
  );
}
