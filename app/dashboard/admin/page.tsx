import Link from "next/link";
import Image from "next/image";

export default function AdminPage() {
  // Mock Campaign Data
  const campaigns = [
    {
      id: 1,
      title: "Reforest Borneo",
      status: "Active",
      raised: 15000000,
      target: 50000000,
      trees: 1500,
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      title: "Urban Green Jakarta",
      status: "Planning",
      raised: 5000000,
      target: 25000000,
      trees: 200,
      image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      title: "Save Sumatra Tigers",
      status: "Completed",
      raised: 75000000,
      target: 70000000,
      trees: 3000,
      image: "https://images.unsplash.com/photo-1596356453261-0d265ae2520d?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div className="text-black space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Halo Ridwan</h1>
          <p className="text-gray-500">Buat, Kelola, dan Sebarkan Kampanye</p>
        </div>
        <Link
          href="/dashboard/admin/add"
          className="px-4 py-2 bg-leaf-600 hover:bg-leaf-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <i className="bx bx-plus"></i> Buat Kampanye
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Kampanye</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Total Dana</th>
                <th className="px-6 py-4 font-medium">Total Pohon</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                        <Image
                          src={""}
                          alt={campaign.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium text-gray-800">{campaign.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${campaign.status === 'Active' ? 'bg-green-100 text-green-800' :
                          campaign.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'}`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Rp {campaign.raised.toLocaleString()} <span className="text-xs text-gray-400">/ {campaign.target.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {campaign.trees} 🌲
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/admin/${campaign.id}`}
                      className="text-leaf-600 hover:text-leaf-800 font-medium text-sm"
                    >
                      Kelola
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
