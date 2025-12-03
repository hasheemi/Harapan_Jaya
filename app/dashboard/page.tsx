import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  // Hardcoded User Data
  const user = {
    name: "Ridwan Adisurya",
    email: "ridwan@example.com",
    joinDate: "November 2023",
    avatar: "https://ui-avatars.com/api/?name=Ridwan+Adisurya&background=6fbf68&color=fff",
    totalTrees: 145,
    rank: 12,
    co2Reduced: "3,625 kg",
    pollutionReduced: "12%",
  };

  // Mock Donation History
  const donations = [
    { id: 1, campaign: "Reforest Borneo", trees: 50, date: "2024-11-25" },
    { id: 2, campaign: "Urban Green Jakarta", trees: 20, date: "2024-11-10" },
    { id: 3, campaign: "Save Sumatra Tigers", trees: 30, date: "2024-10-05" },
    { id: 4, campaign: "Mangrove Restoration", trees: 45, date: "2024-09-20" },
  ];

  // Latest Donation
  const latestDonation = donations[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Selamat Datang, {user.name}!</p>
        </div>
        <Link
          href="/dashboard/campaigns"
          className="px-4 py-2 bg-leaf-500 hover:bg-leaf-700 text-white rounded-lg transition-colors shadow-sm flex items-center gap-2"
        >
          <i className="bx bx-plus-circle"></i> Donasi
        </Link>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Profile Card */}
        <div className="h-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4">
          <Image
            src={user.avatar}
            alt={user.name}
            width={60}
            height={60}
            className="rounded-full"
          />
          <div className="text-center">
            <h3 className="font-semibold text-gray-800">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-xs text-leaf-500 mt-1">Member since {user.joinDate}</p>
          </div>
        </div>

        {/* Total Trees Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="font-bold text-black text-2xl mb-4">My Activity</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-200 to-green-500  py-4 px-2 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-[70px] h-[70px] block flex items-center justify-center bg-green-500 rounded-full">
                <i className="bx bxs-tree text-white text-3xl"></i>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500 text-sm font-medium">Donasi Pohon</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">{user.totalTrees}</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-200 to-blue-500 py-4 px-2 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-[70px] h-[70px] block flex items-center justify-center bg-blue-500 rounded-full">
                <i className="bx bx-wind text-white text-3xl"></i>
              </div>
              <div className="text-center">
                <h3 className="text-gray-500 text-sm font-medium">CO2 Reduced</h3>
                <p className="text-3xl font-bold text-gray-800">{user.co2Reduced}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area - 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Latest Donation */}
          <div className="bg-gradient-to-r from-leaf-500 to-leaf-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-leaf-100 font-medium mb-1">Kontribusi Terakhir</h3>
              <h2 className="text-2xl font-bold mb-4">{latestDonation.campaign}</h2>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-xs text-leaf-100">Pohon yang ditanam</p>
                  <p className="text-xl font-bold">{latestDonation.trees}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-xs text-leaf-100">Tanggal</p>
                  <p className="text-xl font-bold">{latestDonation.date}</p>
                </div>
              </div>
            </div>
            <i className="bx bxs-tree absolute -bottom-4 -right-4 text-9xl text-white/10"></i>
          </div>

          {/* Donation History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Riwayat Donasi</h3>
              <Link href="#" className="text-sm text-leaf-600 hover:text-leaf-700 font-medium">Lihat Semua</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 font-medium">Kampanye</th>
                    <th className="px-6 py-3 font-medium">Pohon yang ditanam</th>
                    <th className="px-6 py-3 font-medium">Tanggal</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {donations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{donation.campaign}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{donation.trees}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{donation.date}</td>
                      <td className="px-6 py-4">
                        <span className="badge !bg-leaf-700 !text-white">
                          Sukses
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Area - 1 Column */}
        <div className="space-y-6">
          {/* Quick Action / Promo */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2">Jadilah Anggota</h3>
            <p className="text-sm text-blue-700 mb-4">Buat campaign dan berikan donasi pohon untuk lingkungan.</p>
            <Link href="/dashboard/upgrade" className="block w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg text-sm font-medium transition-colors">
              Daftar Sekarang
            </Link>
          </div>
          {/* Leaderboard Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">Leaderboard</h3>
              <Link href="/dashboard/leaderboard" className="text-sm text-leaf-600 hover:text-leaf-700">Lihat Semua</Link>
            </div>
            <div className="text-center mb-6 p-4 bg-leaf-50 rounded-lg border border-leaf-100">
              <p className="text-sm text-gray-600">Peringkatmu </p>
              <p className="text-4xl font-bold text-black">#{user.rank}</p>
              <p className="text-xs text-gray-500 mt-1">Top 15 Bulan ini!</p>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${i === 1 ? 'bg-yellow-100 text-yellow-700' : i === 2 ? 'bg-gray-100 text-gray-700' : 'bg-orange-100 text-orange-700'}`}>
                      {i}
                    </span>
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Hamba Allah</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">200 🌲</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
