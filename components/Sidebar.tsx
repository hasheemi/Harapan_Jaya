"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = pathname?.startsWith("/dashboard/admin");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: "bx-grid-alt" },
    { name: "Leaderboard", href: "/dashboard/leaderboard", icon: "bx-trophy" },
    { name: "Campaigns", href: "/dashboard/campaigns", icon: "bx-news" },
    { name: "Upgrade", href: "/dashboard/upgrade", icon: "bx-up-arrow-circle" },
    { name: "Admin", href: "/dashboard/admin", icon: "bx-shield-quarter" },
  ];
  const adminMenuItems = [
    { name: "Profile", href: "/dashboard/admin/profile", icon: "bx-user" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full px-4">
          {/* Logo Area */}
          <div className="py-6 border-b border-gray-100 flex items-center justify-center w-full">
            <button
              className="p-2 bg-green-500! text-black flex justify-center items-center w-[50px] h-[50px] rounded-md md:hidden focus:border-leaf-400"
              onClick={toggleSidebar}
            >
              <i className={`bx ${isOpen ? "bx-x" : "bx-menu"} text-2xl`}></i>
            </button>
            <h1 className="text-2xl font-bold text-leaf-700 hidden items-center gap-2 md:flex">
              <i className="bx bxs-leaf"></i> Resapling
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                      ? "bg-leaf-100 text-leaf-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-leaf-600"
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  <i className={`bx ${item.icon} text-xl`}></i>
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {isAdmin &&
              adminMenuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                        ? "bg-leaf-100 text-leaf-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-leaf-600"
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <i className={`bx ${item.icon} text-xl`}></i>
                    <span>{item.name}</span>
                  </Link>
                );
              })
            }
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-100">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200">
              <i className="bx bx-log-out text-xl"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
