"use client";

import { Component, useState, useEffect } from "react";
import Root from "../../components/Root";
import Nathan from "@/public/assets/img/person/nathan.jpg";

function MediaSosial() {
  let [socialMediaUrl, setSocialMediaUrl] = useState("https://");
  return (
    <>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Media Sosial</legend>
        <input
          className="input w-full"
          type="url"
          required
          placeholder="https://"
          value={socialMediaUrl}
          onChange={(e) => setSocialMediaUrl(e.target.value)}
          pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9\-].*[a-zA-Z0-9])?\.)+[a-zA-Z].*$"
          title="Must be valid URL"
        />
      </fieldset>
    </>
  );
}

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneNumber, setIsPhoneNumber] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    yayasanName: "",
    yayasanPhone: "",
    yayasanAddress: "",
    yayasanNPWP: "",
    yayasanSocialMedia: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setFormData({
          fullName: parsedData.name || "",
          phoneNumber: parsedData.yayasanTel || "",
          yayasanName: parsedData.yayasanName || "",
          yayasanPhone: parsedData.yayasanTel || "",
          yayasanAddress: parsedData.yayasanLoc || "",
          yayasanNPWP: parsedData.yayasanNPWP || "",
          yayasanSocialMedia: parsedData.yayasanSoc || "https://",
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const userData = localStorage.getItem("user");
    let userEmail = "";

    if (userData) {
      const parsedData = JSON.parse(userData);
      userEmail = parsedData.email;
    }
    try {
      const response = await fetch("/api/profile/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          email: userEmail, // Kirim email bersama data lainnya
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profil berhasil diperbarui!");

        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedData = JSON.parse(userData);
          const updatedUser = {
            ...parsedData,
            name: formData.fullName,
            yayasanTel: formData.yayasanPhone,
            yayasanName: formData.yayasanName,
            yayasanLoc: formData.yayasanAddress,
            yayasanNPWP: formData.yayasanNPWP,
            yayasanSoc: formData.yayasanSocialMedia,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } else {
        alert(`Gagal memperbarui profil: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Terjadi kesalahan saat memperbarui profil");
    }

    setIsLoading(false);
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Edit Profil
        </h1>
        <p className="text-gray-600 mt-1">
          Ubah alamat maupun media sosial pribadi dan yayasan
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
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
                  name="fullName"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                  placeholder="e.g. Yayasan Hijau Indonesia"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                  placeholder="+62 812 3456 7890"
                  value={formData.phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
                {isPhoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    Nomor telepon harus memiliki minimal 10 angka
                  </p>
                )}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

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
                  name="yayasanName"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                  placeholder="e.g. Yayasan Hijau Indonesia"
                  value={formData.yayasanName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="yayasanPhone"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                  placeholder="+62 812 3456 7890"
                  value={formData.yayasanPhone}
                  onChange={handlePhoneNumberChange}
                />
                {isPhoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    Nomor telepon harus memiliki minimal 10 angka
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="yayasanAddress"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                  placeholder="Alamat lengkap yayasan"
                  value={formData.yayasanAddress}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NPWP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="yayasanNPWP"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                  placeholder="Nomor Pokok Wajib Pajak"
                  value={formData.yayasanNPWP}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Media Sosial <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="yayasanSocialMedia"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none transition-all"
                  placeholder="https://"
                  value={formData.yayasanSocialMedia}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <hr className="border-gray-100" />

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-leaf-600 hover:bg-leaf-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <i className="bx bx-loader-alt bx-spin"></i> Menyimpan...
                </>
              ) : (
                <>
                  Simpan Perubahan <i className="bx bx-save"></i>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
