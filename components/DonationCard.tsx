import Image from "next/image";
import Link from "next/link";

interface DonationCardProps {
  image: string;
  title: string;
  description: string;
  current: number;
  target: number;
  progress: number;
  deadline: string;
  location: string;
  mitra: string;
  medan: string;
}

export default function DonationCard({
  image,
  title,
  description,
  current,
  target,
  progress,
  deadline,
  mitra,
  medan,
  location,
}: DonationCardProps) {
  return (
      <div
        className="card bg-white rounded-xl shadow-md overflow-hidden border-2 border-gray-200"
      >
        <Image
          src={image}
          alt={title}
          width={400}
          height={250}
          className="w-full h-48 object-cover rounded-t-xl"
        />
        <div className="p-4">
          <h3 className="text-green-500 font-bold text-lg">{title}</h3>
          {/* Tambahkan property tempat, Mitra, dan medan */}
          <div>
            <div className="flex md:flex-row flex-col gap-2 md:items-center mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1"><i className="bx bx-map"></i> {location}</span>
              <span className="flex items-center gap-1"><i className="bx bx-buildings"></i>
                {mitra}</span>
              <span className="flex items-center gap-1"><i className="bx bx-landscape"></i> {medan}</span>
            </div>
          </div>
          <p className="title text-gray-600 text-sm mt-2">{description}</p>

          <p className="text-black target text-sm mt-3">
            {current.toLocaleString()} Bibit <span className="text-gray-500">Target {target.toLocaleString()} Bibit</span>
          </p>

          <div className="progress bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="full bg-leaf-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p className="deadline text-sm text-gray-500 mt-2">{deadline}</p>
        </div>
      </div>
  );
}
