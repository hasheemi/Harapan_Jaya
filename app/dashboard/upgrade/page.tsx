"use client";

import { Component, useState } from "react";
import Root from "../components/Root";
import LeaderBoard from "../components/LeaderBoard";

function Biodata({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: any;
}) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev: any) => ({
        ...prev,
        KTP: file,
      }));
    }
  };

  return (
    <>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Nama</legend>
        <input
          type="text"
          name="nama"
          className="input w-full"
          placeholder="Type here"
          value={formData.nama || ""}
          onChange={handleInputChange}
        />
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Nomor Telepon</legend>
        <input
          type="number"
          name="nomorTelepon"
          className="input w-full"
          placeholder="Type here"
          value={formData.nomorTelepon || ""}
          onChange={handleInputChange}
        />
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">KTP</legend>
        <input
          type="file"
          name="KTP"
          className="file-input w-full"
          onChange={handleFileChange}
        />
      </fieldset>
    </>
  );
}

function DataYayasan({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: any;
}) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Nama Yayasan</legend>
        <input
          onChange={handleInputChange}
          type="text"
          name="namaYayasan"
          className="input w-full"
          placeholder="Type here"
          value={formData.namaYayasan || ""}
        />
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Alamat Yayasan</legend>
        <input
          onChange={handleInputChange}
          type="text"
          name="alamatYayasan"
          className="input w-full"
          placeholder="Type here"
          value={formData.alamatYayasan || ""}
        />
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Nomor Telepon Yayasan</legend>
        <input
          onChange={handleInputChange}
          type="number"
          name="nomorTeleponYayasan"
          className="input w-full"
          placeholder="Type here"
          value={formData.nomorTeleponYayasan || ""}
        />
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">NPWP Yayasan</legend>
        <input
          onChange={handleInputChange}
          type="number"
          name="npwp"
          className="input w-full"
          placeholder="Type here"
          value={formData.npwp || ""}
        />
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Media Sosial</legend>
        <input
          className="input w-full"
          type="url"
          name="socialMediaUrl"
          required
          placeholder="https://"
          value={formData.socialMediaUrl || ""}
          onChange={handleInputChange}
          pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9\-].*[a-zA-Z0-9])?\.)+[a-zA-Z].*$"
          title="Must be valid URL"
        />
      </fieldset>
    </>
  );
}

function File({ formData, setFormData }: { formData: any; setFormData: any }) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const fieldName = e.target.name;

    if (file) {
      setFormData((prev: any) => ({
        ...prev,
        [fieldName]: file,
      }));
    }
  };

  return (
    <>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Surat Izin Operasional</legend>
        <input
          type="file"
          name="suratIzinOperasional"
          className="file-input w-full"
          onChange={handleFileChange}
        />
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Surat Pendirian LSM</legend>
        <input
          type="file"
          name="suratPendirianLSM"
          className="file-input w-full"
          onChange={handleFileChange}
        />
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">
          Surat Pengesahan Badan Hukum
        </legend>
        <input
          type="file"
          name="suratPengesahanBadanHukum"
          className="file-input w-full"
          onChange={handleFileChange}
        />
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Surat Domisili Yayasan</legend>
        <input
          type="file"
          name="suratDomisiliYayasan"
          className="file-input w-full"
          onChange={handleFileChange}
        />
      </fieldset>
    </>
  );
}

function KonfirmasiUlang({ formData }: { formData: any }) {
  // Filter hanya data teks (bukan file)
  const textData = Object.entries(formData).reduce((acc: any, [key, value]) => {
    if (!(value instanceof File)) {
      acc[key] = value;
    }
    return acc;
  }, {});

  return (
    <>
      <p className="font-bold mb-4">Konfirmasi data yang telah dimasukkan:</p>
      <div className="bg-white p-4 rounded-lg">
        <pre className="text-sm">{JSON.stringify(textData, null, 2)}</pre>
      </div>
    </>
  );
}

export default function Upgrade() {
  let [Step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    nama: "",
    nomorTelepon: "",
    namaYayasan: "",
    alamatYayasan: "",
    nomorTeleponYayasan: "",
    npwp: "",
    socialMediaUrl: "",
    KTP: null,
    suratIzinOperasional: null,
    suratPendirianLSM: null,
    suratPengesahanBadanHukum: null,
    suratDomisiliYayasan: null,
  });

  const handleNextStep = (step: number) => {
    if (Step < 3) {
      setStep(step);
    }
  };

  // Tambahkan type guard function
  const isFile = (value: any): value is File => {
    return value instanceof File;
  };

  const handleSubmit = async () => {
    try {
      // Buat FormData untuk mengirim file dan data teks
      const submitFormData = new FormData();

      // Tambahkan data teks
      Object.entries(formData).forEach(([key, value]) => {
        if (isFile(value)) {
          submitFormData.append(key, value);
        } else if (value !== null && value !== undefined) {
          submitFormData.append(key, value.toString());
        }
      });

      // Kirim ke API
      const response = await fetch("/api/upgrade", {
        method: "POST",
        body: submitFormData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        alert("Data berhasil dikirim!");
      } else {
        throw new Error("Failed to submit data");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan saat mengirim data");
    }
  };
  const renderStepContent = () => {
    switch (Step) {
      case 0:
        return <Biodata formData={formData} setFormData={setFormData} />;
      case 1:
        return <DataYayasan formData={formData} setFormData={setFormData} />;
      case 2:
        return <File formData={formData} setFormData={setFormData} />;
      case 3:
        return <KonfirmasiUlang formData={formData} />;
      default:
        return <Biodata formData={formData} setFormData={setFormData} />;
    }
  };

  const getStepClass = (index: number) => {
    if (index < Step) return "step step-success";
    if (index === Step) return "step step-primary";
    return "step";
  };

  const handleStepButtonClick = () => {
    if (Step < 3) {
      handleNextStep(Step + 1);
    } else {
      handleSubmit();
    }
  };

  return (
    <Root>
      <div className="w-full min-h-screen bg-leaf-50 flex flex-col gap-4 p-4">
        <p className="text-2xl font-bold">Upgrade Akun - Formulir Yayasan</p>
        <ul className="steps">
          <li onClick={() => handleNextStep(0)} className={getStepClass(0)}>
            Biodata
          </li>
          <li onClick={() => handleNextStep(1)} className={getStepClass(1)}>
            Data Yayasan
          </li>
          <li onClick={() => handleNextStep(2)} className={getStepClass(2)}>
            File Yayasan
          </li>
          <li className={getStepClass(3)}>Konfirmasi Ulang</li>
        </ul>
        <div className="w-full flex justify-center">
          <div className="w-full max-w-2xl bg-gray-200 rounded-xl p-4 flex flex-col gap-3">
            {renderStepContent()}
            <button
              className="btn btn-success w-full mt-4"
              onClick={handleStepButtonClick}
            >
              {Step < 3 ? "Next" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </Root>
  );
}
