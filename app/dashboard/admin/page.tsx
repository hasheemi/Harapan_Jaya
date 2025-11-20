"use client";

import { useEffect } from "react";
import Root from "../components/Root";
import LeaderBoard from "../components/LeaderBoard";
import "./style.css";
import DonationCard from "@/components/DonationCard";

export default function Campaign() {
  useEffect(() => {
    // Initialize AOS
    if (typeof window !== "undefined") {
      const AOS = require("aos");
      AOS.init({
        duration: 1000,
        once: true,
      });
    }
  }, []);

  return (
    <Root show={true}>
      <div data-aos="fade-right" >
        <p className="text-3xl font-bold"> Hallo Ridwan </p>
        <p> Siap menjadi pahlawan hijau hari ini? </p>
      </div>
      <div className="grid grid-cols-1 w-full gap-4 sm:grid-cols-3">
        <a
          className="bg-white shadow-xl/20 border-green-950 w-full h-[150px] rounded-2xl p-4 block"
          data-aos="flip-up"
          href="/dashboard/admin/campaign"
        >
          <div className="bg-green-800 rounded border-2 border-white w-[50px] h-[50px] flex items-center justify-center ">
            <i className='bx bx-message-add text-white text-2xl'></i>
          </div>
          <p className="text-xl font-bold">Buat Campaign</p>
        </a>
        <a
          className="bg-white shadow-xl/20 border-green-950 w-full h-[150px] rounded-2xl p-4"
          data-aos="flip-up"
          href="/dashboard/admin/data"
        >
          <div className="bg-green-800 rounded border-2 border-white w-[50px] h-[50px] flex items-center justify-center">
            <i className='bx bx-box text-white text-2xl'></i>
          </div>
          <p className="text-xl font-bold">Cek Data</p>
        </a>
        <a
          className="bg-white shadow-xl/20 border-green-950 w-full h-[150px] rounded-2xl p-4"
          data-aos="flip-up"
          href="/dashboard/admin/profile"
        >
          <div className="bg-green-800 rounded border-2 border-white w-[50px] h-[50px] flex items-center justify-center">
            <i className='bx bx-user text-white text-2xl'></i>
          </div>
          <p className="text-xl font-bold">Update Profil</p>
        </a>
      </div>
      <section className="donation pb-20">
        <div className="flex justify-between">
          <p className="text-3xl font-bold" data-aos="fade-right">Campaign</p>
          <a href="/dashboard/admin/campaign" className="bg-green-800 text-2xl text-white rounded-full w-10 h-10 justify-center items-center mr-5 hidden lg:flex"> {'>'} </a>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-12 mt-10 mx-auto justify-between">
          {donationCards.map((card, index) => (
          <DonationCard key={index} {...card} />
          ))}
        </div>
      </section>
    </Root>
  );
}

const donationCards = [
  {
    image: "/assets/img/item/sinarmas.jpeg",
    title: "Sinarmas",
    description: "Menanam kembali kertas menjadi pohon bersama PT. Sinarmas",
    current: "240,210 Bibit",
    target: "500,000 Bibit",
    progress: 49,
    deadline: "6 hari lagi",
  },
  {
    image: "/assets/img/item/ikn.jpg",
    title: "Otorita IKA-EN",
    description: "Revitalisasi Hutan di Kalimantan akibat proyek strategis",
    current: "147,783 Bibit",
    target: "600,000 Bibit",
    progress: 23,
    deadline: "2 Minggu lagi",
  },
  {
    image: "/assets/img/item/gemarsorong.jpg",
    title: "Hulujaya",
    description: "Reboisasi Mangrove pencegah abrasi di Sorong Papua",
    current: "21,023 Bibit",
    target: "100,000 Bibit",
    progress: 21,
    deadline: "1 Bulan lagi",
  },
];