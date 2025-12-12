import React from "react";

interface PodiumProps {
  item: {
    image: string;
    [key: string]: any; // for any additional unknown properties
  };
  index: number;
}

function Podium({ item, index }: PodiumProps) {
  const heightClass = index === 0 ? "h-32" : index === 1 ? "h-28" : "h-24";

  return (
    <div className="h-60 flex-1 flex flex-row items-end text-black">
      <div key={index} className="flex flex-1 flex-col gap-2">
        <div className="flex flex-col items-center">
          <div className="avatar">
            <div className="w-14 rounded-full">
              <img src={item.image} />
            </div>
          </div>
          <span className="text-sm text-center">{item.name}</span>
          <span>{item.amount}</span>
        </div>
        <div
          className={`${
            index === 0
              ? "bg-green-600"
              : index === 1
              ? "bg-green-500"
              : "bg-green-400"
          } w-full min-w-36 rounded-box p-4 ${heightClass} flex items-center justify-center`}
        >
          <span className="text-4xl font-bold text-white">{index + 1}</span>
        </div>
      </div>
    </div>
  );
}

export default Podium;
