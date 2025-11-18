"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import LeaderBoard from "./LeaderBoard";

interface RootProps {
  children: React.ReactNode;
  show?: boolean;
}

export default function Root({ children, show = false }: RootProps) {
  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.min.css"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,300,0,0"
      />
      <div data-theme="emerald">
        <div className="w-full bg-leaf-300 flex flex-row">
          <Sidebar show = {show}/>
          <div className="w-full p-4 h-screen bg-leaf-50 flex flex-col gap-4">
            {/* Content */}
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
