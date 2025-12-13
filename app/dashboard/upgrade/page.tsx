"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

interface FormData {
  fullName: string;
  phoneNumber: string;
  ktpFile: File | null;

  foundationName: string;
  foundationPhone: string;
  foundationAddress: string;
  npwp: string;
  socialMedia: string;

  operationLetter: File | null;
  establishmentLetter: File | null;
  legalizationLetter: File | null;
  domicileLetter: File | null;
}

export default function UpgradePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneNumber, setIsPhoneNumber] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phoneNumber: "",
    ktpFile: null,
    foundationName: "",
    foundationPhone: "",
    foundationAddress: "",
    npwp: "",
    socialMedia: "",
    operationLetter: null,
    establishmentLetter: null,
    legalizationLetter: null,
    domicileLetter: null,
  });

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (value.length < 10) {
      setIsPhoneNumber(true);
    } else {
      setIsPhoneNumber(false);
    }
    handleInputChange(event);
  };

  const { logout } = useAuth();
  const localData = JSON.parse(localStorage.getItem("user") ?? "");

  const handleLogout = () => {
    logout(); // Panggil fungsi logout
    console.log("Logout");
    window.location.href = "/login";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const fieldName = e.target.name;

    if (file) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {

      const submitFormData = new FormData();
      submitFormData.append("myemail", localData.email);
      let fileCount = 0;
      let textCount = 0;

      // Tambahkan data teks dan file
      Object.entries(formData).forEach(([key, value]) => {
        if (
          value &&
          typeof value === "object" &&
          "name" in value &&
          "size" in value &&
          "type" in value
        ) {
          // Type assertion
          const file = value as File;
          submitFormData.append(key, file);
          fileCount++;
        } else if (value !== null && value !== undefined) {
          submitFormData.append(key, value.toString());
          textCount++;
        }
      });

      for (let [key, value] of submitFormData.entries()) {
        console.log(
          `${key}:`,
          value instanceof File
            ? `File: ${value.name} (${value.size} bytes)`
            : value
        );
      }

      const response = await fetch("http://localhost:4000/api/upgrade", {
        method: "POST",
        body: submitFormData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);

        toast.success(
          "Permohonan Telah diterima, anda sekarang bisa membuat campaign donasi",
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
        toast.info("login ulang terlebih dahulu", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(handleLogout, 1000);
      } else {
        const errorText = await response.text();
        console.error("Server error:", response.status, errorText);
        throw new Error(
          `Failed to submit data: ${response.status} ${errorText}`
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        "Terjadi kesalahan saat mengirim data: " + (error as Error).message,
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
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto text-black">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Jadi Admin Di Resapling
        </h1>
        <p className="text-gray-500 mt-2">
          Jadi admin di Resapling dan mulai membuat campaign donasi pohon.
          Jadilah Pahlawan Hijau untuk masa depan Indonesia.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <i className="bx bxs-user text-leaf-500"></i> Detail Pribadi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                  placeholder="e.g. Yayasan Hijau Indonesia"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handlePhoneNumberChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                  placeholder="+62 812 3456 7890"
                />
                {isPhoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    Nomor telepon harus memiliki minimal 10 angka
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KTP / ID Card (JPG, PNG){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    name="ktpFile"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="ktp-upload"
                    required
                  />
                  <label htmlFor="ktp-upload" className="cursor-pointer block">
                    <div className="text-gray-500 mb-2">
                      <i className="bx bx-cloud-upload text-3xl"></i>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formData.ktpFile
                        ? formData.ktpFile.name
                        : "Klik untuk upload KTP / ID Card"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Format: JPG, PNG, PDF (max 5MB)
                    </p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Organization Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <i className="bx bxs-building-house text-leaf-500"></i> Detail
              Yayasan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Yayasan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="foundationName"
                  value={formData.foundationName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                  placeholder="e.g. Yayasan Hijau Indonesia"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="foundationPhone"
                  value={formData.foundationPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                  placeholder="+62 812 3456 7890"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="foundationAddress"
                  value={formData.foundationAddress}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                  placeholder="Alamat lengkap yayasan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NPWP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="npwp"
                  value={formData.npwp}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                  placeholder="Nomor Pokok Wajib Pajak"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Media Sosial <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="socialMedia"
                  value={formData.socialMedia}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                  placeholder="https://"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Document Uploads */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <i className="bx bxs-cloud-upload text-leaf-500"></i> Dokumen
              Yayasan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surat Izin Operasional (PDF){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    name="operationLetter"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="operation-letter-upload"
                    required
                  />
                  <label
                    htmlFor="operation-letter-upload"
                    className="cursor-pointer block"
                  >
                    <div className="text-gray-500 mb-2">
                      <i className="bx bx-cloud-upload text-3xl"></i>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formData.operationLetter
                        ? formData.operationLetter.name
                        : "Klik untuk upload Surat Izin Operasional"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Format: JPG, PNG, PDF (max 5MB)
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surat Pendirian LSM (PDF){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    name="establishmentLetter"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="establishment-letter-upload"
                    required
                  />
                  <label
                    htmlFor="establishment-letter-upload"
                    className="cursor-pointer block"
                  >
                    <div className="text-gray-500 mb-2">
                      <i className="bx bx-cloud-upload text-3xl"></i>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formData.establishmentLetter
                        ? formData.establishmentLetter.name
                        : "Klik untuk upload Surat Pendirian LSM"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Format: JPG, PNG, PDF (max 5MB)
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surat Pengesahan Badan Hukum (PDF){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    name="legalizationLetter"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="legalization-letter-upload"
                    required
                  />
                  <label
                    htmlFor="legalization-letter-upload"
                    className="cursor-pointer block"
                  >
                    <div className="text-gray-500 mb-2">
                      <i className="bx bx-cloud-upload text-3xl"></i>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formData.legalizationLetter
                        ? formData.legalizationLetter.name
                        : "Klik untuk upload Surat Pengesahan Badan Hukum"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Format: JPG, PNG, PDF (max 5MB)
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surat Domisili Yayasan (PDF){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    name="domicileLetter"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="domicile-letter-upload"
                    required
                  />
                  <label
                    htmlFor="domicile-letter-upload"
                    className="cursor-pointer block"
                  >
                    <div className="text-gray-500 mb-2">
                      <i className="bx bx-cloud-upload text-3xl"></i>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formData.domicileLetter
                        ? formData.domicileLetter.name
                        : "Klik untuk upload Surat Domisili Yayasan"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Format: JPG, PNG, PDF (max 5MB)
                    </p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-leaf-600 hover:bg-leaf-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <i className="bx bx-loader-alt bx-spin"></i> Submitting...
                </>
              ) : (
                <>
                  Submit Application <i className="bx bx-send"></i>
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              Dengan mengirimkan formulir ini, Anda menyetujui Ketentuan Layanan
              dan Kebijakan Privasi kami.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
