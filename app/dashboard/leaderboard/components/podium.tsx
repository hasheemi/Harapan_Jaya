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
    <button className="h-60 flex-1 flex flex-row items-end">
      <div key={index} className="flex flex-1 flex-col gap-2">
        <div className="flex flex-col items-center">
          <div className="avatar">
            <div className="w-14 rounded-full">
              <img src={item.image} />
            </div>
          </div>
          <span className="text-sm">{item.name}</span>
          <span>{item.amount}</span>
        </div>
        <div
          className={`bg-base-200 w-full rounded-box p-4 ${heightClass} flex items-center justify-center`}
        >
          <div className="text-4xl font-thin opacity-30 tabular-nums mr-4">
            {index + 1}
          </div>
        </div>
      </div>
    </button>
  );
}

export default Podium;
