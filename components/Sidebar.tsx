"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = pathname?.startsWith("/dashboard/admin");
  const { logout } = useAuth();
  const localData = JSON.parse(localStorage.getItem("user") ?? "");

  const handleLogout = () => {
    logout(); // Panggil fungsi logout
    console.log("Logout");
    window.location.href = "/login";
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768); // Assuming 768px as the desktop breakpoint
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      console.log(isOpen);
    };
  }, []);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: "bx-grid-alt" },
    { name: "Mybibit", href: "/dashboard/history", icon: "bxs-leaf" },
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
      <button
        className={`fixed right-0 top-4 p-2 bg-green-500! text-black z-50 justify-center items-center w-[50px] h-[50px] rounded-md flex focus:border-leaf-400 ${
          window.innerWidth >= 768 ? "hidden" : ""
        }`}
        onClick={toggleSidebar}
      >
        <i className={`bx ${isOpen ? "bx-x" : "bx-menu"} text-2xl`}></i>
      </button>
      <aside
        className={`fixed ${
          isOpen || window.innerWidth >= 768 ? "left-0" : "left-[-500px]"
        } top-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50 `}
      >
        <div className="flex flex-col h-full px-4">
          {/* Logo Area */}
          <div className="py-6 border-b border-gray-100 flex items-center justify-center w-full">
            <span className="self-center text-3xl font-semibold whitespace-nowrap text-leaf-900 relogo ml-0!">
              Resapling
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              if (localData.isYayasan == "false" && item.name == "Admin")
                return null;
              if (localData.isYayasan == "true" && item.name == "Upgrade")
                return null;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
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
              localData.isYayasan == "true" &&
              adminMenuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
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
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-100">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
              onClick={handleLogout}
            >
              <i className="bx bx-log-out text-xl"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
