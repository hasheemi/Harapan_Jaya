"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
// import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import "react-quill-new/dist/quill.snow.css";
import "leaflet/dist/leaflet.css"; // IMPORTANT: Add this!

// Data medan dan jenis pohon
const MEDAN_DATA = {
  hutan: [
    { value: "jati", label: "Jati" },
    { value: "mahoni", label: "Mahoni" },
    { value: "sengon", label: "Sengon" },
    { value: "lainnya", label: "Lainnya" },
  ],
  pesisir: [
    { value: "mangrove", label: "Mangrove" },
    { value: "api-api", label: "Api-api" },
    { value: "bakau", label: "Bakau" },
    { value: "lainnya", label: "Lainnya" },
  ],
  lahan: [
    { value: "mangga", label: "Mangga" },
    { value: "rambutan", label: "Rambutan" },
    { value: "durian", label: "Durian" },
    { value: "lainnya", label: "Lainnya" },
  ],
};

// Dynamic import untuk Leaflet dengan loading state
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const LeafletMap = dynamic(() => import("../../history/maps/LeafletMap"), {
  ssr: false,
});

export default function AddCampaignPage() {
  // const { data: session, status } = useSession();
  const router = useRouter();

  // Form states
  const [judul, setJudul] = useState("");
  const [targetDonasi, setTargetDonasi] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalBerakhir, setTanggalBerakhir] = useState("");
  const [description, setDescription] = useState("");
  const [posterFile, setPosterFile] = useState<File | null>(null);

  // Medan dan jenis pohon states
  const [selectedMedan, setSelectedMedan] = useState<string>("");
  const [selectedJenisPohon, setSelectedJenisPohon] = useState<string>("");
  const [jenisPohonOptions, setJenisPohonOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [showLainnyaInput, setShowLainnyaInput] = useState(false);
  const [lainnyaValue, setLainnyaValue] = useState("");
  const [tanggalPlanning, setTanggalPlanning] = useState("");

  // Map state
  const [coords, setCoords] = useState<[number, number] | null>(null);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check authentication
  // Get user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  // Check authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Update jenis pohon options ketika medan berubah
  useEffect(() => {
    if (selectedMedan && MEDAN_DATA[selectedMedan as keyof typeof MEDAN_DATA]) {
      setJenisPohonOptions(
        MEDAN_DATA[selectedMedan as keyof typeof MEDAN_DATA]
      );
      setSelectedJenisPohon(""); // Reset pilihan jenis pohon
      setShowLainnyaInput(false); // Reset input lainnya
      setLainnyaValue(""); // Reset nilai lainnya
    }
  }, [selectedMedan]);

  // Handle perubahan jenis pohon
  const handleJenisPohonChange = (value: string) => {
    setSelectedJenisPohon(value);
    setShowLainnyaInput(value === "lainnya");
    if (value !== "lainnya") {
      setLainnyaValue("");
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("File harus berupa gambar");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB");
        return;
      }
      setPosterFile(file);
      setError(null);
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    // Validation
    if (!coords) {
      setError("Silakan pilih lokasi eksak pada peta");
      return;
    }

    if (!posterFile) {
      setError("Silakan upload poster kampanye");
      return;
    }

    // Validate dates

    const startDate = new Date(tanggalMulai);
    const planningDate = new Date(tanggalPlanning);
    const endDate = new Date(tanggalBerakhir);
    if (endDate <= startDate) {
      setError("Tanggal berakhir harus setelah tanggal mulai");
      return;
    }

    if (planningDate < startDate) {
      setError("Tanggal planning harus setelah tanggal mulai kampanye");
      return;
    }

    if (planningDate > endDate) {
      setError("Tanggal planning harus sebelum tanggal berakhir kampanye");
      return;
    }

    // Get final jenis pohon value
    const finalJenisPohon =
      selectedJenisPohon === "lainnya" ? lainnyaValue : selectedJenisPohon;

    setIsLoading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("judul", judul);
      formData.append("target_donasi", targetDonasi);
      formData.append("lokasi", lokasi);
      formData.append("tanggal_mulai", tanggalMulai);
      formData.append("tanggal_berakhir", tanggalBerakhir);
      formData.append("tanggal_planning", tanggalPlanning);
      formData.append("deskripsi", description);
      formData.append("medan", selectedMedan);
      formData.append("jenis_pohon", finalJenisPohon);
      formData.append("jenis_pohon_asli", selectedJenisPohon);
      formData.append("lat", coords[0].toString());
      formData.append("lng", coords[1].toString());
      // formData.append("poster", posterFile);
      if (posterFile) {
        formData.append("file", posterFile); // Field name HARUS 'file'
      }
      // userId
      formData.append("userId", user?.name || "");
      formData.append("userEmail", user?.email || "");
      formData.append("userName", user?.yayasanName || "");
      // Send to API
      const response = await fetch("/api/campaign/add", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create campaign");
      }

      // Success
      setSuccess(true);
      setIsLoading(false);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/campaigns");
      }, 2000);
    } catch (error: any) {
      console.error("Error creating campaign:", error);
      setError(error.message || "Terjadi kesalahan saat membuat kampanye");
      setIsLoading(false);
    }
  }

  // Reset form
  const handleReset = () => {
    setJudul("");
    setTargetDonasi("");
    setLokasi("");
    setTanggalMulai("");
    setTanggalBerakhir("");
    setDescription("");
    setSelectedMedan("");
    setSelectedJenisPohon("");
    setLainnyaValue("");
    setPosterFile(null);
    setCoords(null);
    setError(null);
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Buat Kampanye Baru</h1>
        <p className="text-gray-600 mt-2">
          Isi detail kampanye penanaman pohon
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
                Kampanye berhasil dibuat!
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Redirecting to campaigns page...
              </p>
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
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Judul Kampanye */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul Kampanye <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                placeholder="e.g. Hijaukan Kembali Hutan Sumatra"
              />
            </div>

            {/* Target Donasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Donasi (jumlah bibit pohon){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={targetDonasi}
                onChange={(e) => setTargetDonasi(e.target.value)}
                required
                min="0"
                className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                placeholder="5000"
                style={{
                  WebkitAppearance: "none",
                  MozAppearance: "textfield",
                }}
              />
            </div>

            {/* Lokasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                placeholder="e.g. North Jakarta Coast"
              />
            </div>

            {/* Tanggal Mulai */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={tanggalMulai}
                onChange={(e) => setTanggalMulai(e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
                className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
              />
            </div>

            {/* Tanggal Berakhir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Berakhir <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={tanggalBerakhir}
                onChange={(e) => setTanggalBerakhir(e.target.value)}
                required
                min={tanggalMulai || new Date().toISOString().split("T")[0]}
                className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
              />
            </div>

            {/* Select Medan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medan Tanam <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedMedan}
                onChange={(e) => setSelectedMedan(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all bg-white"
              >
                <option value="">Pilih Medan</option>
                <option value="hutan">Hutan</option>
                <option value="pesisir">Pesisir</option>
                <option value="lahan">Lahan</option>
              </select>
            </div>

            {/* Select Jenis Pohon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Pohon <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedJenisPohon}
                onChange={(e) => handleJenisPohonChange(e.target.value)}
                required
                disabled={!selectedMedan}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all bg-white disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="">Pilih Jenis Pohon</option>
                {jenisPohonOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Input untuk Lainnya */}
            {showLainnyaInput && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pohon Lainnya <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={lainnyaValue}
                  onChange={(e) => setLainnyaValue(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                  placeholder="Masukkan nama pohon lainnya"
                />
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Planning Penanaman <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={tanggalPlanning}
              onChange={(e) => setTanggalPlanning(e.target.value)}
              required
              min={tanggalMulai || new Date().toISOString().split("T")[0]}
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
            />
            <p className="text-sm text-gray-500 mt-1">
              Tanggal rencana penanaman pohon akan dilaksanakan
            </p>
          </div>

          {/* Map */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lokasi Eksak <span className="text-red-500">*</span>
              {coords && (
                <span className="text-sm text-green-600 ml-2">
                  Dipilih: {coords[0].toFixed(4)}, {coords[1].toFixed(4)}
                </span>
              )}
            </label>
            <div className="h-[400px] mb-4 border rounded-lg overflow-hidden">
              <LeafletMap coords={coords} setCoords={setCoords} />
            </div>
          </div>

          {/* Poster Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Poster <span className="text-red-500">*</span>
              {posterFile && (
                <span className="text-sm text-green-600 ml-2">
                  {posterFile.name} ({(posterFile.size / 1024).toFixed(2)} KB)
                </span>
              )}
            </label>
            <label
              htmlFor="poster-image-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-leaf-500 transition-colors"
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
                id="poster-image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="hidden"
              />
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <div className="h-64 mb-12">
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                className="h-full"
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
              Reset
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batalkan
            </button>
            <button
              type="submit"
              disabled={isLoading || success}
              className="flex-1 bg-leaf-600 hover:bg-leaf-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <i className="bx bx-loader-alt bx-spin"></i> Membuat
                  Kampanye...
                </>
              ) : success ? (
                <>
                  <i className="bx bx-check"></i> Berhasil!
                </>
              ) : (
                <>
                  Sebarkan Kampanye <i className="bx bxs-megaphone"></i>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
