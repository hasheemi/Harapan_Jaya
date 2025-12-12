"use client";

import Image from "next/image";
import Podium from "./components/podium";
import Marchindise from "@/public/assets/img/item/Marchindise.png";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UserData {
  id: string;
  name: string;
  email: string;
  photo: string;
  totalPohon: number;
  totalDonation?: number;
  isUser?: boolean; // Untuk menandai user yang sedang login
}

export default function LeaderboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Ambil data leaderboard dari Firebase
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        // Ambil data user yang sedang login dari localStorage
        const storedUser = localStorage.getItem("user");
        let currentUserData = null;

        if (storedUser) {
          try {
            currentUserData = JSON.parse(storedUser);
            setCurrentUser({
              id: "current",
              name: currentUserData.name || "User",
              email: currentUserData.email || "",
              photo:
                currentUserData.photo ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  currentUserData.name || "User"
                )}&background=6fbf68&color=fff`,
              totalPohon: currentUserData.totalPohon || 0,
              totalDonation: currentUserData.totalDonation || 0,
              isUser: true,
            });
          } catch (err) {
            console.warn("Error parsing user data:", err);
          }
        }

        // Ambil top 10 users berdasarkan totalPohon
        const usersRef = collection(db, "usersv2");
        const q = query(usersRef, orderBy("totalPohon", "desc"), limit(10));

        const querySnapshot = await getDocs(q);
        const usersList: UserData[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Skip jika totalPohon 0 atau tidak ada
          const totalPohon = data.totalPohon || 0;
          if (totalPohon >= 0) {
            usersList.push({
              id: doc.id,
              name: data.name || "Anonymous",
              email: data.email || "",
              photo:
                data.photo ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  data.name || "Anonymous"
                )}&background=random`,
              totalPohon: totalPohon,
              totalDonation: data.totalDonation || 0,
            });
          }
        });

        // Jika user saat ini tidak ada di top 10, tambahkan di posisi terakhir
        if (currentUserData && currentUserData.totalPohon > 0) {
          const userInTopList = usersList.find(
            (user) => user.email === currentUserData.email
          );

          if (!userInTopList) {
            // Cari posisi user di leaderboard
            const userPosition = usersList.findIndex(
              (user) => user.totalPohon <= (currentUserData.totalPohon || 0)
            );

            if (userPosition !== -1) {
              // Sisipkan di posisi yang benar
              usersList.splice(userPosition, 0, {
                id: "current",
                name: currentUserData.name || "User",
                email: currentUserData.email || "",
                photo:
                  currentUserData.photo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    currentUserData.name || "User"
                  )}&background=6fbf68&color=fff`,
                totalPohon: currentUserData.totalPohon || 0,
                totalDonation: currentUserData.totalDonation || 0,
                isUser: true,
              });

              // Hapus yang terakhir jika lebih dari 10
              if (usersList.length > 10) {
                usersList.pop();
              }
            } else if (usersList.length < 10) {
              // Tambahkan di akhir jika masih ada slot
              usersList.push({
                id: "current",
                name: currentUserData.name || "User",
                email: currentUserData.email || "",
                photo:
                  currentUserData.photo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    currentUserData.name || "User"
                  )}&background=6fbf68&color=fff`,
                totalPohon: currentUserData.totalPohon || 0,
                totalDonation: currentUserData.totalDonation || 0,
                isUser: true,
              });
            }
          }
        }

        // Beri ranking
        const rankedUsers = usersList.map((user, index) => ({
          ...user,
          rank: index + 1,
          isUser: user.email === currentUserData?.email,
        }));

        setLeaderboard(rankedUsers);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        // Fallback data jika error
        setLeaderboard(getFallbackData(currentUser));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Fungsi fallback jika data tidak ada atau error
  const getFallbackData = (currentUser: any) => {
    const mockData = [
      {
        rank: 1,
        name: "Green Earth Foundation",
        totalPohon: 1250,
        photo: "https://ui-avatars.com/api/?name=Green+Earth&background=random",
        isUser: false,
      },
      {
        rank: 2,
        name: "EcoWarriors Jakarta",
        totalPohon: 980,
        photo:
          "https://ui-avatars.com/api/?name=Eco+Warriors&background=random",
        isUser: false,
      },
      {
        rank: 3,
        name: "Sarah Johnson",
        totalPohon: 850,
        photo:
          "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random",
        isUser: false,
      },
      {
        rank: 4,
        name: "PT. Suka Bumi Indah",
        totalPohon: 720,
        photo: "https://ui-avatars.com/api/?name=Suka+Bumi&background=random",
        isUser: false,
      },
      {
        rank: 5,
        name: "Budi Santoso",
        totalPohon: 650,
        photo:
          "https://ui-avatars.com/api/?name=Budi+Santoso&background=random",
        isUser: false,
      },
      {
        rank: 6,
        name: "Rina Melati",
        totalPohon: 500,
        photo: "https://ui-avatars.com/api/?name=Rina+Melati&background=random",
        isUser: false,
      },
      {
        rank: 7,
        name: "Tech for Good",
        totalPohon: 450,
        photo: "https://ui-avatars.com/api/?name=Tech+Good&background=random",
        isUser: false,
      },
      {
        rank: 8,
        name: "Andi Wijaya",
        totalPohon: 300,
        photo: "https://ui-avatars.com/api/?name=Andi+Wijaya&background=random",
        isUser: false,
      },
      {
        rank: 9,
        name: "Community Care",
        totalPohon: 280,
        photo:
          "https://ui-avatars.com/api/?name=Community+Care&background=random",
        isUser: false,
      },
      {
        rank: 10,
        name: "Dewi Lestari",
        totalPohon: 250,
        photo:
          "https://ui-avatars.com/api/?name=Dewi+Lestari&background=random",
        isUser: false,
      },
    ];

    // Tambahkan user saat ini jika ada
    if (currentUser && currentUser.totalPohon > 0) {
      const userRank =
        mockData.findIndex(
          (user) => user.totalPohon <= currentUser.totalPohon
        ) + 1;
      mockData.splice(userRank - 1, 0, {
        ...currentUser,
        rank: userRank,
        isUser: true,
      });

      // Update rank untuk semua item
      mockData.forEach((item, index) => {
        item.rank = index + 1;
      });
    }

    return mockData;
  };

  // Ambil data untuk podium (top 3)
  const podiumData = leaderboard.slice(0, 3);

  // Handle kasus jika data kurang dari 3
  const getPodiumItem = (index: number) => {
    if (podiumData[index]) {
      return {
        name: podiumData[index].name,
        image: podiumData[index].photo,
        amount: podiumData[index].totalPohon,
      };
    }

    // Fallback jika data tidak cukup
    const fallbackNames = ["Green Hero", "Eco Champion", "Nature Saver"];
    return {
      name: fallbackNames[index],
      image: "https://ui-avatars.com/api/?name=User&background=ccc&color=fff",
      amount: 0,
    };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Leaderboard</h1>
          <p className="text-gray-500">Lihat Pahlawan Hijau yang terbaik</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Memuat leaderboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Leaderboard</h1>
          <p className="text-gray-500">Lihat Pahlawan Hijau yang terbaik</p>
        </div>
      </div>

      {/* Podium Section */}
      {leaderboard.length >= 3 ? (
        <div className="flex justify-center gap-4 items-end mb-8 h-64">
          {/* Rank 2 */}
          <div className="">
            <Podium item={getPodiumItem(1)} index={1} />
          </div>

          {/* Rank 1 */}
          <div className="">
            <Podium item={getPodiumItem(0)} index={0} />
          </div>

          {/* Rank 3 */}
          <div className="">
            <Podium item={getPodiumItem(2)} index={2} />
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center mb-8">
          <p className="text-yellow-800">
            {leaderboard.length === 0
              ? "Belum ada data leaderboard. Jadilah yang pertama mendonasikan pohon!"
              : `Hanya ada ${leaderboard.length} pahlawan hijau. Ayo donasikan pohon untuk masuk leaderboard!`}
          </p>
        </div>
      )}

      {leaderboard.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-20">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium w-20 text-center">
                    Peringkat
                  </th>
                  <th className="px-6 py-4 font-medium">UserName</th>
                  <th className="px-6 py-4 font-medium text-right">
                    Pohon yang di donasikan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaderboard.map((item) => (
                  <tr
                    key={item.rank || item.id}
                    className={`transition-colors ${
                      item.isUser
                        ? "bg-leaf-50 hover:bg-leaf-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                          ${
                            item.rank === 1
                              ? "bg-yellow-100 text-yellow-700"
                              : item.rank === 2
                              ? "bg-gray-100 text-gray-700"
                              : item.rank === 3
                              ? "bg-orange-100 text-orange-700"
                              : "text-gray-500"
                          }`}
                      >
                        {item.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <Image
                          src={item.photo}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <p
                            className={`font-medium ${
                              item.isUser ? "text-green-800" : "text-gray-800"
                            }`}
                          >
                            {item.name} {item.isUser && "(You)"}
                          </p>
                          {item.email && (
                            <p className="text-xs text-gray-500">
                              {item.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-gray-800">
                        {item.totalPohon.toLocaleString()}
                      </span>{" "}
                      🌲
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center mb-20">
          <div className="text-gray-400 mb-4">
            <i className="bx bx-tree text-5xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            Leaderboard Kosong
          </h3>
          <p className="text-gray-500 mb-4">
            Belum ada yang mendonasikan pohon. Jadilah yang pertama!
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard/campaigns")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-leaf-500 hover:bg-leaf-700 text-white rounded-lg transition-colors"
          >
            <i className="bx bx-plus-circle"></i>
            Donasi Sekarang
          </button>
        </div>
      )}

      <div className="fixed bottom-0 right-0 md:right-2 w-[75%]">
        <div className="relative w-full bg-white rounded-2xl px-8 py-4 shadow-lg border-2 !border-green-500">
          <p className="text-green-900 font-bold text-lg md:text-3xl">
            Ayo Jadi Pahlawan Hijau! <br className="md:hidden" />
            Dapatkan Merchandise Menarik!
          </p>

          <p className="text-green-700 text-sm md:text-lg mt-1">
            Leaderboard di-reset tiap semester. Masih banyak waktu untuk
            berbagi!
          </p>

          <Image
            src={Marchindise}
            alt="Merchandise"
            width={isOpen ? 280 : 1}
            height={isOpen ? 280 : 1}
            className="absolute right-0 bottom-4"
          />
        </div>
      </div>
    </div>
  );
}
