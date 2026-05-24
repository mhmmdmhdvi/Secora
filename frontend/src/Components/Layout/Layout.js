import React, { useState, useEffect } from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

function Layout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access"));
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const syncAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("access"));
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {isLoggedIn ? (
        <>
          {/* Mobile top bar */}
          <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40">
            <h1 className="text-lg font-bold text-gray-900">SecureLearn</h1>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="text-gray-700 hover:text-black"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>

          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            mobileSidebarOpen={mobileSidebarOpen}
            setMobileSidebarOpen={setMobileSidebarOpen}
          />

          <main
            className={`
              transition-all duration-300
              pt-20 md:pt-6 px-4 sm:px-6 lg:px-8
              ${collapsed ? "md:ml-16" : "md:ml-56"}
            `}
          >
            {children}
          </main>
        </>
      ) : (
        <>
          <Header />
          <main className="pt-20 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </>
      )}
    </div>
  );
}

export default Layout;
