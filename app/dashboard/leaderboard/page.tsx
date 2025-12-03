"use client"

import Image from "next/image";
import Podium from "./components/podium";
import Marchindise from "@/public/assets/img/item/Marchindise.png"
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
      const handleResize = () => {
        setIsOpen(window.innerWidth >= 768); // Assuming 768px as the desktop breakpoint
      };
  
      handleResize(); // Set initial state
      window.addEventListener("resize", handleResize);
  
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);
  // Mock Leaderboard Data
  const leaderboard = [
    { rank: 1, name: "Green Earth Foundation", trees: 1250, avatar: "https://ui-avatars.com/api/?name=Green+Earth&background=random" },
    { rank: 2, name: "EcoWarriors Jakarta", trees: 980, avatar: "https://ui-avatars.com/api/?name=Eco+Warriors&background=random" },
    { rank: 3, name: "Sarah Johnson", trees: 850, avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random" },
    { rank: 4, name: "PT. Suka Bumi Indah", trees: 720, avatar: "https://ui-avatars.com/api/?name=Suka+Bumi&background=random" },
    { rank: 5, name: "Budi Santoso", trees: 650, avatar: "https://ui-avatars.com/api/?name=Budi+Santoso&background=random" },
    { rank: 6, name: "Rina Melati", trees: 500, avatar: "https://ui-avatars.com/api/?name=Rina+Melati&background=random" },
    { rank: 7, name: "Tech for Good", trees: 450, avatar: "https://ui-avatars.com/api/?name=Tech+Good&background=random" },
    { rank: 8, name: "Andi Wijaya", trees: 300, avatar: "https://ui-avatars.com/api/?name=Andi+Wijaya&background=random" },
    { rank: 9, name: "Community Care", trees: 280, avatar: "https://ui-avatars.com/api/?name=Community+Care&background=random" },
    { rank: 10, name: "Dewi Lestari", trees: 250, avatar: "https://ui-avatars.com/api/?name=Dewi+Lestari&background=random" },
    { rank: 11, name: "Nature Lovers", trees: 200, avatar: "https://ui-avatars.com/api/?name=Nature+Lovers&background=random" },
    { rank: 12, name: "Ridwan Adisurya", trees: 145, avatar: "https://ui-avatars.com/api/?name=Ridwan+Adisurya&background=6fbf68&color=fff", isUser: true },
    { rank: 13, name: "Global Green", trees: 120, avatar: "https://ui-avatars.com/api/?name=Global+Green&background=random" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Leaderboard</h1>
          <p className="text-gray-500">Lihat Pahlawan Hijau yang terbaik</p>
        </div>
      </div>

      {/* Podium Section */}
      <div className="flex justify-center gap-4 items-end mb-8 h-64">
        {/* Rank 2 */}
        <div className="">
          <Podium
            item={{
              name: leaderboard[1].name,
              image: leaderboard[1].avatar,
              amount: leaderboard[1].trees
            }}
            index={1}
          />
        </div>

        {/* Rank 1 */}
        <div className="">
          <Podium
            item={{
              name: leaderboard[0].name,
              image: leaderboard[0].avatar,
              amount: leaderboard[0].trees
            }}
            index={0}
          />
        </div>

        {/* Rank 3 */}
        <div className="">
          <Podium
            item={{
              name: leaderboard[2].name,
              image: leaderboard[2].avatar,
              amount: leaderboard[2].trees
            }}
            index={2}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-20">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium w-20 text-center">Peringkat</th>
                <th className="px-6 py-4 font-medium">UserName</th>
                <th className="px-6 py-4 font-medium text-right">Pohon yang di donasikan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaderboard.map((item) => (
                <tr
                  key={item.rank}
                  className={`transition-colors ${item.isUser ? 'bg-leaf-50 hover:bg-leaf-100' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                        ${item.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                          item.rank === 2 ? 'bg-gray-100 text-gray-700' :
                            item.rank === 3 ? 'bg-orange-100 text-orange-700' :
                              'text-gray-500'}`}
                    >
                      {item.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className={`font-medium ${item.isUser ? 'text-green-800' : 'text-gray-800'}`}>
                          {item.name} {item.isUser && "(You)"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-gray-800">{item.trees}</span> 🌲
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={`fixed bottom-0 right-0 md:right-2 ${isOpen ? "w-[85%]" : "w-full"}`}>
        <div className="relative w-full bg-green-500 rounded-xl p-4 border-4 border-solid border-yellow-500">
          <p className="md:text-3xl! text-lg font-bold">Ayo Jadilah Pahlawan Hijau dan <br className="md:hidden"/>dapatkan Marchindise Menarik! </p>
          <p className="md:text-lg! text-sm">Leaderboard Di reset tiap Semester masih banyak waktu untuk berbagi!</p>
          <Image src={Marchindise} alt="Merchandise" width={isOpen ? 300 : 1} height={isOpen ? 300: 1} lazyRoot="lazy" className="absolute right-0 bottom-10" />
        </div>
      </div>
    </div>
  );
}
