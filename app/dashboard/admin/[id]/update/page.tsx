"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { collection, query, where, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import { orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import "react-quill-new/dist/quill.snow.css";

// Dynamic import untuk ReactQuill
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export default function UpdateCampaignPage() {
  const router = useRouter();
  const params = useParams();

  // Ambil campaignId dari params URL
  const campaignId = params.id as string;

  // Form states
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (optional - image only)
      if (!file.type.startsWith("image/")) {
        setError("File harus berupa gambar");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB");
        return;
      }
      setImageFile(file);
      setError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // Validation
    if (!judul.trim()) {
      setError("Judul update tidak boleh kosong");
      return;
    }

    if (!deskripsi.trim() || deskripsi === "<p><br></p>") {
      setError("Deskripsi update tidak boleh kosong");
      return;
    }

    setIsLoading(true);

    try {
      // Get user data from localStorage (asumsi user sudah login)
      const userDataStr = localStorage.getItem("user");
      if (!userDataStr) {
        throw new Error("User data not found. Please login again.");
      }

      const userData = JSON.parse(userDataStr);

      // Prepare form data
      const formData = new FormData();
      formData.append("judul", judul);
      formData.append("deskripsi", deskripsi);
      formData.append("campaignId", campaignId);
      formData.append("userEmail", userData.email);
      formData.append("userName", userData.yayasanName || userData.name);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Console log
      // console.log("=== FormData Contents ===");
      // for (const [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // }
      // console.log("=== END FormData Contents ===");

      // Call API
      const response = await fetch("/api/campaign/update", {
        method: "POST",
        body: formData,
        // When sending FormData, the 'Content-Type' header is automatically set to 'multipart/form-data'
        // by the browser, so we should NOT set it manually here.
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal membuat update");
      }

      // Success state
      setSuccess(true);
      setIsLoading(false);

      // Reset form setelah 2 detik
      setTimeout(() => {
        setJudul("");
        setDeskripsi("");
        setImageFile(null);
        setSuccess(false);

        // Optional: Redirect ke halaman campaign detail
        router.push(`/dashboard/admin/${campaignId}`);
      }, 2000);
    } catch (error: any) {
      console.error("Error creating update:", error);
      setError(error.message || "Terjadi kesalahan saat membuat update");
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setJudul("");
    setDeskripsi("");
    setImageFile(null);
    setError(null);
  };

  return (
    <div className="max-w-full mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <i className="bx bx-arrow-back"></i>
          Kembali
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          Buat Update Campaign
        </h1>
        <p className="text-gray-600 mt-2">
          Bagikan perkembangan terbaru kampanye kepada donatur
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="bx bx-check-circle text-green-500 text-xl"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Update berhasil disimpan!
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="bx bx-error text-red-500 text-xl"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Terjadi kesalahan
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign ID Info */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <i className="bx bx-info-circle text-blue-500"></i>
              <span className="text-sm font-medium text-blue-800">
                Campaign ID:{" "}
                <code className="bg-blue-100 px-2 py-1 rounded">
                  {campaignId}
                </code>
              </span>
            </div>
          </div>

          {/* Judul Update */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul Update <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
              placeholder="e.g. Progress Pembelian Bibit Mangrove Tahap 1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Beri judul yang informatif tentang update ini
            </p>
          </div>

          {/* Image Upload (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto Dokumentasi (Opsional)
              {imageFile && (
                <span className="text-sm text-green-600 ml-2">
                  {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                </span>
              )}
            </label>
            <label
              htmlFor="update-image-upload"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-leaf-500 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L7 9m3-3 3 3"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF (MAX. 5MB)
                </p>
              </div>
              <input
                id="update-image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Upload foto dokumentasi seperti bibit yang sudah dibeli, lokasi
              survey, atau progress penanaman
            </p>
          </div>

          {/* Deskripsi Update */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi Update <span className="text-red-500">*</span>
            </label>
            <div className="h-64 mb-12">
              <ReactQuill
                theme="snow"
                value={deskripsi}
                onChange={setDeskripsi}
                className="h-full"
                placeholder="Tuliskan detail update kampanye..."
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
              />
            </div>
          </div>



          {/* Form Actions */}
          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isLoading || success}
              className="flex-1 bg-leaf-600 hover:bg-leaf-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <i className="bx bx-loader-alt bx-spin"></i> Menyimpan...
                </>
              ) : success ? (
                <>
                  <i className="bx bx-check"></i> Berhasil!
                </>
              ) : (
                <>
                  Simpan Update <i className="bx bxs-save"></i>
                </>
              )}
            </button>
          </div>
        </form>
      </div>


    </div>
  );
}
