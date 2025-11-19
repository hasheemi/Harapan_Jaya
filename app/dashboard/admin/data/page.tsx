"use client";

import { Component } from "react";
import Image from "next/image";
import Root from "@/app/dashboard/components/Root";

const userName = "Ridwan";

function DataCreate(){
  return(
    <>
      <tr className="border border-gray-200 hover:bg-blue-50 cursor-pointer">
        <td className="border border-gray-200 p-4 text-center">
          <input type="checkbox" className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500" />
        </td>
        <td className="border border-gray-200 p-4">April 28, 2016</td>
        <td className="border border-gray-200 p-4 font-medium text-gray-900">speakers</td>
        <td className="border border-gray-200 p-4">$16.00 - $18.00</td>
        <td className="border border-gray-200 p-4">
          <span
            className="badge badge-success"> Success </span>
        </td>
        <td className="border border-gray-200 p-4 text-center cursor-pointer text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-5 w-5" fill="none" stroke="currentColor"
            stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </td>
      </tr>
    </>
  )
}

export default class Data extends Component {
  render() {
    return (
      <Root show={true}>
        <div className="w-full p-4">
          <h3 className="text-3xl text-black"> Halo {userName}</h3>
          <p> Kelola, Simpan dan Bagikan! </p>
        </div>
        <div className="w-full flex"> 
          <div className="p-4 flex-10" data-aos="fade-right">
            <div className="bg-white rounded-xl shadow-md p-4 max-w-full overflow-x-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Ringkasan Keuangan</h2>
                <div className="flex gap-4">
                  <button className="btn btn-success"> Create Summarize </button>
                  <button className="btn btn-success"> Import to CSV </button>
                </div>
              </div>

              <div className="mb-4 flex space-x-4">
                <input type="text" placeholder="Search..."
                  className="grow border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <select
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Batch Action</option>
                  <option>Delete</option>
                  <option>Export</option>
                </select>
                <select
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Serial Number</option>
                  <option>Date</option>
                  <option>Status</option>
                </select>
              </div>

              <table className="min-w-full table-auto border-collapse border text-gray-700 text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="border border-gray-200 p-4 w-10">
                      <input type="checkbox" className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500" />
                    </th>
                    <th className="border border-gray-200 p-4">Tanggal</th>
                    <th className="border border-gray-200 p-4">Username</th>
                    <th className="border border-gray-200 p-4">Jumlah</th>
                    <th className="border border-gray-200 p-4">Status</th>
                    <th className="border border-gray-200 p-4 w-16 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <DataCreate />
                  <DataCreate />
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4" data-aos="fade-left">
              <div className="flex flex-col w-sm items-center bg-white rounded-2xl p-4">
                <div className="flex justify-end gap-1 w-full">
                  <p className="text-3xl font-bold text-right">Sedang <br /> berlangsung</p>
                  <span className="rounded-full bg-green-500 block w-2 h-2"></span>
                </div>
                <span className="w-full h-0.5 bg-gray-400 block mt-4"></span>
                <Image
                  src="/assets/img/item/sinarmas.jpeg"
                  alt=""
                  width={300}
                  height={100}
                  className="object-cover rounded-xl mt-4"
                />
                <h3 className="text-[8rem] mt-4 text-center"> Menanam kembali kertas menjadi pohon bersama PT. Sinarmas </h3>
                <div className="mt-4 inline-flex justify-between w-full">
                  <p> Target Terkumpul </p>
                  <p className="font-bold"> Rp 30.000.000</p>
                </div>
                <progress className="progress progress-success w-56 mt-4" value="10" max="100"></progress>
                <button className="btn btn-success mt-4 w-full "> Check </button>
              </div>
          </div>
        </div>

      </Root>
    );
  }
}