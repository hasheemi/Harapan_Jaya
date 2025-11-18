"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return pathname === path
      ? "text-leaf-900 bg-leaf-200 rounded-full"
      : "text-leaf-900 rounded-full";
  };

  return (
    <div className="flex flex-col">
      <Link
        href="/"
        className="w-full px-4 pt-3 pb-2 flex justify-center items-center space-x-3 relogo"
        onClick={() => {}}
      >
        <span className="self-center text-3xl font-semibold whitespace-nowrap text-leaf-900">
          Resapling
        </span>
      </Link>
      <ul className="w-60 p-4 h-screen menu">
        <li>
          <Link
            className={isActive("/dashboard")}
            href="/dashboard"
            onClick={closeMenu}
          >
            <span className="material-symbols-rounded">dashboard</span>
            Dashboard
          </Link>
          <Link
            className={isActive("/dashboard/campaign")}
            href="/dashboard/campaign"
            onClick={closeMenu}
          >
            <span className="material-symbols-rounded">volunteer_activism</span>
            Kampanye
          </Link>
        </li>
      </ul>
    </div>
  );
}
