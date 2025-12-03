"use client";

import { useState } from "react";

export default function UpgradePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPhoneNumber, setIsPhoneNumber] = useState(false);

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length < 10) {
      setIsPhoneNumber(true);
    } else {
      setIsPhoneNumber(false);
    }
  };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    alert("Application submitted successfully! We will review your documents.");
  }

  return (
    <div className="mx-auto text-black">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Jadi Admin Di Resapling</h1>
        <p className="text-gray-500 mt-2">
          Jadi admin di Resapling dan mulai membuat campaign donasi pohon. Jadilah Pahlawan Hijau untuk masa depan Indonesia.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
          <div>
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
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                  placeholder="+62 812 3456 7890"
                  onChange={handlePhoneNumberChange}
                />
                {isPhoneNumber && (
                  <p className="text-red-500 text-sm mt-1">Nomor telepon harus memiliki minimal 10 angka</p>
                )}
              </div>
              <div className="md:col-span-2">
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  KTP / ID Card (JPG, PNG) <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-leaf-500 transition-colors cursor-pointer bg-gray-50">
                  <i className="bx bx-image-add text-3xl text-gray-400 mb-2"></i>
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">Max file size: 5MB</p>
                  <input type="file" className="hidden" accept="image/*" required />
                </div>
              </div> */}
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                KTP / ID Card (JPG, PNG) <span className="text-red-500">*</span>
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
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />
          {/* Organization Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <i className="bx bxs-building-house text-leaf-500"></i> Detail Yayasan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Yayasan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
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
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                  placeholder="+62 812 3456 7890"
                  onChange={handlePhoneNumberChange}
                />
                {isPhoneNumber && (
                  <p className="text-red-500 text-sm mt-1">Nomor telepon harus memiliki minimal 10 angka</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                  placeholder="contact@foundation.org"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NPWP <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
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
                  type="tel"
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
              <i className="bx bxs-cloud-upload text-leaf-500"></i> Dokumen Yayasan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Surat Izin Operasional (PDF) <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-leaf-500 transition-colors cursor-pointer bg-gray-50">
                  <i className="bx bx-upload text-3xl text-gray-400 mb-2"></i>
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">Max file size: 10MB</p>
                  <input type="file" className="hidden" accept=".pdf" required />
                </div>
              </div> */}
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surat Pendirian LSM (PDF) <span className="text-red-500">*</span>
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
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Surat Pendirian LSM (PDF) <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-leaf-500 transition-colors cursor-pointer bg-gray-50">
                  <i className="bx bx-upload text-3xl text-gray-400 mb-2"></i>
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">Max file size: 10MB</p>
                  <input type="file" className="hidden" accept=".pdf" required />
                </div>
              </div> */}
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surat Pendirian LSM (PDF) <span className="text-red-500">*</span>
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
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Surat Pengesahan Badan Hukum (PDF) <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-leaf-500 transition-colors cursor-pointer bg-gray-50">
                  <i className="bx bx-upload text-3xl text-gray-400 mb-2"></i>
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">Max file size: 10MB</p>
                  <input type="file" accept=".pdf" required />
                </div>
              </div> */}
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surat Pengesahan Badan Hukum (PDF) <span className="text-red-500">*</span>
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
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Surat Domisili Yayasan (PDF) <span className="text-red-500">*</span>
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-leaf-500 transition-colors cursor-pointer bg-gray-50">
                  <i className="bx bx-upload text-3xl text-gray-400 mb-2"></i>
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">Max file size: 10MB</p>
                  <input type="file" className="file-input top-0 left-0 w-full h-full opacity-0 absolute" accept=".pdf" required />
                </div>
              </div> */}
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surat Domisili Yayasan (PDF) <span className="text-red-500">*</span>
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
              Dengan mengirimkan formulir ini, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
