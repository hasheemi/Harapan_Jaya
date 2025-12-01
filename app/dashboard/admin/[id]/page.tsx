"use client"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";


function DataCreate() {
  return (
    <>
      <tr className="border border-gray-200 hover:bg-blue-50 cursor-pointer">
        <td className="border border-gray-200 p-4">April 28, 2016</td>
        <td className="border border-gray-200 p-4 font-medium text-gray-900">
          speakers
        </td>
        <td className="border border-gray-200 p-4">$16.00 - $18.00</td>
        <td className="border border-gray-200 p-4">
          <span className="badge !bg-leaf-700 !text-white"> Success </span>
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

function DataShow() {
  return (
    <>
      <div className="w-full flex bg-amber-300 text-black">
        <div className="p-4 flex-10">
          <div className="bg-white rounded-xl shadow-md p-4 max-w-full overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Ringkasan Keuangan
              </h2>
              <div className="flex gap-4">
                <button className="btn !bg-leaf-700 !text-white">
                  Kirim Bukti
                </button>
                <button className="btn !bg-leaf-700 !text-white">
                  Export ke CSV
                </button>
              </div>
            </div>

            <div className="mb-4 flex space-x-4">
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

            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-4 text-left text-sm font-semibold text-gray-700">
                    Tanggal
                  </th>
                  <th className="border border-gray-200 p-4 text-left text-sm font-semibold text-gray-700">
                    Username
                  </th>
                  <th className="border border-gray-200 p-4 text-left text-sm font-semibold text-gray-700">
                    Jumlah
                  </th>
                  <th className="border border-gray-200 p-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="border border-gray-200 p-4 text-center w-16 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Example usage of DataCreate component as a table row */}
                <DataCreate />
                <DataCreate />
                <DataCreate />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}


function Description({campaign}: {campaign: any}){
    return(
        <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Total Donasi</h3>
                    <p className="text-3xl font-bold text-gray-800">Rp {campaign.raised.toLocaleString()}</p>
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

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Akumulasi Pohon</h3>
                    <p className="text-3xl font-bold text-gray-800">{campaign.trees}</p>
                    <p className="text-xs text-leaf-600 mt-1 flex items-center gap-1">
                        <i className="bx bx-up-arrow-alt"></i> +120 Minggu ini
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Total Donatur</h3>
                    <p className="text-3xl font-bold text-gray-800">{campaign.donors.length}</p>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800">History Donatur</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3 font-medium">Nama</th>
                                <th className="px-6 py-3 font-medium">Jumlah</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {campaign.donors.map((donor) => (
                                <tr key={donor.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{donor.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">Rp {donor.amount.toLocaleString()}</td>
                                    <td className={donor.status === "Success" ? "px-6 py-4 text-sm text-green-500" : "px-6 py-4 text-sm text-red-500"}>{donor.status}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{donor.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
        plantingDate: "2024-12-15",
        raised: 15000000,
        target: 50000000,
        trees: 1500,
        donors: [
            { id: 1, name: "John Doe", amount: 500000,  status:"Success", date: "2025-11-28" },
            { id: 2, name: "Jane Smith", amount: 250000,  status:"Success", date: "2025-11-27" },
            { id: 3, name: "Anonymous", amount: 100000,  status:"Success", date: "2025-11-26" },
            { id: 4, name: "Tech Corp", amount: 5000000,  status:"Success", date: "2025-11-25" },
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
                    <h1 className="text-3xl font-bold text-gray-800">{campaign.title}</h1>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><i className="bx bx-map"></i> {campaign.location}</span>
                        <span className="flex items-center gap-1"><i className="bx bx-calendar"></i> Planting: {campaign.plantingDate}</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-bold">{campaign.status}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                        <i className="bx bx-edit"></i> Edit
                    </button>
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
            {activeTab === "Data" && <DataShow />}
            {/* Data ENd */}
        </div>
    );
}
