"use client"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });


function DataCreate({tanggal, username, jumlah, status}: {tanggal: string, username: string, jumlah: number, status: string}) {
  return (
    <>
      <tr className="border border-gray-200 hover:bg-blue-50 cursor-pointer">
        <td className="border border-gray-200 p-4">{tanggal}</td>
        <td className="border border-gray-200 p-4 font-medium text-gray-900">
          {username}
        </td>
        <td className="border border-gray-200 p-4">Rp. {jumlah.toLocaleString()}</td>
        <td className="border border-gray-200 p-4">
          <span className="badge !bg-leaf-700 !text-white"> {status} </span>
        </td>
        <td className="border border-gray-200 p-4 text-center cursor-pointer text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </td>
      </tr>
    </>
  );
}

function DataShow({campaign}: {campaign: any}) {
  return (
    <>
      <div className="w-full border-2 border-gray-200 rounded-xl flex text-black">
        <div className="md:flex-10 w-full">
          <div className="bg-white rounded-xl shadow-md p-4 max-w-full overflow-x-auto relative">
            {/* <div className="flex justify-between w-full items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Tabel Histori
              </h2>
              <div className="flex gap-4 md:w-full">
                <button className="btn btn-xs !bg-leaf-700 !text-white">
                  <p className="md:text-sm text-xs">Export ke CSV</p>
                </button>
              </div>
            </div>

            <div className="mb-4 flex w-full space-x-4">
              <input
                type="text"
                placeholder="Search..."
                className="grow border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Filter</option>
              </select>
            </div> */}
            <div className="sticky top-0 z-10 bg-white pb-4">
              <div className="flex justify-between w-full items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Tabel Histori
                </h2>
                <div className="flex gap-4 md:w-full">
                  <button className="btn btn-xs !bg-leaf-700 !text-white">
                    <p className="md:text-sm text-xs">Export ke CSV</p>
                  </button>
                </div>
              </div>
              <div className="mb-4 flex w-full space-x-4">
                <input
                  type="text"
                  placeholder="Search..."
                  className="grow border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Filter</option>
                  {/* Add more filter options here */}
                </select>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 sticky top-0">
                    <th className="border border-gray-200 md:p-4 p-2 text-center text-sm font-semibold text-gray-700">
                      Tanggal
                    </th>
                    <th className="border border-gray-200 md:p-4 p-2 text-center text-sm font-semibold text-gray-700">
                      Username
                    </th>
                    <th className="border border-gray-200 md:p-4 p-2 text-center text-sm font-semibold text-gray-700">
                      Jumlah
                    </th>
                    <th className="border border-gray-200 md:p-4 p-2 text-center text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="border border-gray-200 md:p-4 p-2 text-center w-16 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Example usage of DataCreate component as a table row */}
                  {
                    campaign.donors.map((donation: any) => (
                      <DataCreate
                        key={donation.id}
                        tanggal={donation.date}
                        username={donation.name}
                        jumlah={donation.amount}
                        status={donation.status}
                      />
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


function Data({campaign}: {campaign: any}){
    return(
        <>
              <div className="p-6 col-span-2">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Total Donasi</h3>
                    <p className="md:text-5xl text-3xl font-bold text-gray-800">Rp {campaign.raised.toLocaleString()}</p>
                    <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
                        <div
                            className="bg-leaf-500 h-2 rounded-full"
                            style={{ width: `${(campaign.raised / campaign.target) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        {Math.round((campaign.raised / campaign.target) * 100)}% dari Target Rp {campaign.target.toLocaleString()}
                    </p>
                </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Latest Donation */}
          <div className="bg-gradient-to-r from-leaf-500 to-leaf-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4">Total Akumulasi</h2>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-xs text-leaf-100">Pohon yang ditanam</p>
                  <p className="text-xl font-bold">{campaign.trees}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-xs text-leaf-100">Dalam</p>
                  <p className="text-xl font-bold">30 hari</p>
                </div>
              </div>
            </div>
            <i className="bx bxs-tree absolute -bottom-4 -right-4 text-9xl text-white/10"></i>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4">Total Donatur</h2>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-xs text-blue-100">Donatur</p>
                  <p className="text-xl font-bold">{campaign.donors.length}</p>
                </div>
              </div>
            </div>
            <i className="bx bxs-donate-heart bx-flip-horizontal absolute -bottom-4 -right-4 text-9xl text-white/10"></i>
          </div>
            </div>
            <DataShow campaign={campaign} />
        </>
    )
}

function CampaignData({campaign}: {campaign: any}) {
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsLoading(false);
        alert("Campaign created successfully!");
    }
  return(
    <>
    <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Judul Kampanye 
                            </label>
                            <h3 className="text-2xl font-bold">{campaign.title}</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Target Donasi 
                            </label>
                            <h3 className="text-xl">Rp{campaign.target.toLocaleString()}</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lokasi
                            </label>
                            <h3 className="text-xl">{campaign.location}</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Mulai 
                            </label>
                            <h3 className="text-xl">{campaign.startDate}</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal berakhir 
                            </label>
                            <h3 className="text-xl">{campaign.plantingDate}</h3>
                        </div>
                    </div>
                    <div>
                    </div>
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description 
                        </label>
                        <p className="text-sm leading-relaxed">
                            Borneo, tanah dengan keanekaragaman hayati yang tak tertandingi, adalah medan pertempuran penting bagi konservasi lingkungan. Aktivitas hijau di sini sering berfokus pada upaya reboisasi, memulihkan hutan hujan yang terdegradasi yang merupakan habitat vital bagi orangutan, gajah kerdil, dan spesies lainnya. Inisiatif ini melibatkan masyarakat lokal dalam menanam pohon asli, membangun praktik agroforestri berkelanjutan, dan melindungi hutan yang ada dari penebangan liar dan ekspansi kelapa sawit. Upaya-upaya tersebut sangat penting dalam memerangi perubahan iklim dan melestarikan warisan ekologi unik pulau ini untuk generasi mendatang.
                        </p>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            className="px-6 py-3 border border-gray-300 text-gray-700  w-full font-bold rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={() => window.history.back()}
                        >
                            <i className="bx bxs-edit"></i> Edit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </>
  )
}

function Description({campaign}: {campaign: any}){
  return(
    <>
      <div className="p-4 text-black flex md:flex-row! flex-col gap-4">
        <div className="flex md:hidden! flex-col w-full items-center bg-white rounded-2xl border-2 border-gray-100 p-4 h-max">
          <Image src="/assets/img/item/sinarmas.jpeg" alt="" width={350} height={100}
            className="object-cover rounded-xl mt-4" />

          <h3 className="text-[8rem] mt-4">
            Menanam kembali kertas menjadi pohon bersama PT. Sinarmas
          </h3>

          <div className="mt-4 inline-flex justify-between w-full">
            <p> Target Terkumpul </p>
            <p className="font-bold"> Rp 30.000.000</p>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
            <div className="bg-leaf-500 h-2 rounded-full"
              style={{ width: `${(campaign.raised / campaign.target) * 100}%` }}></div>
          </div>

          <a href="/campaign/charity" className="btn !bg-leaf-700 text-white mt-4 w-full">
            Check
          </a>
        </div>
        {/* Card in desktop */}
        <div className="flex-col w-sm md:flex hidden items-center bg-white rounded-2xl border-2 border-gray-100 p-4 h-max">
          <Image src="/assets/img/item/sinarmas.jpeg" alt="" width={350} height={100}
            className="object-cover rounded-xl mt-4" />

          <h3 className="text-[8rem] mt-4">
            Menanam kembali kertas menjadi pohon bersama PT. Sinarmas
          </h3>

          <div className="mt-4 inline-flex justify-between w-full">
            <p> Target Terkumpul </p>
            <p className="font-bold"> Rp 30.000.000</p>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
            <div className="bg-leaf-500 h-2 rounded-full"
              style={{ width: `${(campaign.raised / campaign.target) * 100}%` }}></div>
          </div>

          <a href="/campaign/charity" className="btn !bg-leaf-700 text-white mt-4 w-full">
            Check
          </a>
        </div>
        <div className="flex-1">
          <CampaignData campaign={campaign} />
        </div>
      </div>
    </>
  )
}

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
    // Mock Campaign Detail Data (In a real app, fetch based on params.id)
    const campaign = {
        id: params.id,
        title: "Reforest Borneo",
        status: "Active",
        location: "East Kalimantan, Indonesia",
        startDate: "2024-12-01",
        plantingDate: "2024-12-15",
        raised: 15000000,
        target: 50000000,
        trees: 1500,
        donors: [
            { id: 1, name: "John Doe", amount: 500000,  status:"Success", date: "2025-11-28" },
            { id: 2, name: "Jane Smith", amount: 250000,  status:"Success", date: "2025-11-27" },
            { id: 3, name: "Anonymous", amount: 100000,  status:"Success", date: "2025-11-26" },
            { id: 4, name: "Tech Corp", amount: 5000000,  status:"Success", date: "2025-11-25" },
            { id: 5, name: "Tech Corp", amount: 5000000,  status:"Success", date: "2025-11-25" },
            { id: 6, name: "Tech Corp", amount: 5000000,  status:"Success", date: "2025-11-25" },
            { id: 7, name: "Tech Corp", amount: 5000000,  status:"Success", date: "2025-11-25" },
        ],
    };
    const [activeTab, setActiveTab] = useState("Deskripsi");

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/dashboard/admin" className="hover:text-leaf-600">Kampanye</Link>
                <i className="bx bx-chevron-right"></i>
                <span>{campaign.title}</span>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="md:text-3xl text-xl font-bold text-gray-800">{campaign.title}</h1>
                    <div className="flex md:flex-row flex-col gap-2 md:items-center mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><i className="bx bx-map"></i> {campaign.location}</span>
                        <span className="flex items-center gap-1"><i className="bx bx-calendar"></i> Planting: {campaign.plantingDate}</span>
                        <span className="md:inline-block hidden px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-bold">{campaign.status}</span>
                    </div>
                    <span className="w-fit my-4 md:hidden px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-bold">{campaign.status}</span>
                </div>
                <div className="flex gap-2">
                    <div className="flex p-0 border-2 border-gray-200 text-black rounded-lg ">
                        <div className={`cursor-pointer rounded-l-lg p-2 px-4 transition-all text-sm font-medium ${activeTab === "Deskripsi" ? "bg-leaf-500 text-white" : ""}`} onClick={() => setActiveTab("Deskripsi")}>
                            Deskripsi
                        </div>
                        <div className={`cursor-pointer rounded-r-lg p-2 px-4 transition-all text-sm font-medium ${activeTab === "Data" ? "bg-leaf-500 text-white" : ""}`} onClick={() => setActiveTab("Data")}>
                            Data
                        </div>
                        
                    </div>
                </div>
            </div>
            {activeTab == "Deskripsi" && <Description campaign={campaign} />}
            {/* Data STart */}
            {activeTab == "Data" && <Data campaign={campaign} />}
            {/* Data ENd */}
        </div>
    );
}
