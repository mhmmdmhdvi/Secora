import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  BookOpenIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

function Sidebar({
  collapsed,
  setCollapsed,
  mobileSidebarOpen,
  setMobileSidebarOpen,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 md:z-30 h-full bg-white border-r border-gray-300 shadow-md
          transition-all duration-300 flex flex-col
          ${collapsed ? "md:w-16" : "md:w-56"}
          w-64
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Top */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-gray-300 min-h-[64px]">
          {(!collapsed || mobileSidebarOpen) && (
            <h1 className="text-lg font-bold text-gray-900">SecureLearn</h1>
          )}

          {/* Desktop collapse button */}
          <button
            className="hidden md:block text-gray-700 hover:text-black"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          {/* Mobile close button */}
          <button
            className="md:hidden text-gray-700 hover:text-black"
            onClick={closeMobileSidebar}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col mt-6 gap-2 px-2 flex-1">
          <Link
            to="/"
            onClick={closeMobileSidebar}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <HomeIcon className="w-5 h-5 text-gray-800 shrink-0" />
            {(!collapsed || mobileSidebarOpen) && <span>Home</span>}
          </Link>

          <Link
            to="/lessons"
            onClick={closeMobileSidebar}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <BookOpenIcon className="w-5 h-5 text-gray-800 shrink-0" />
            {(!collapsed || mobileSidebarOpen) && <span>Lessons</span>}
          </Link>
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-300 px-2 py-4">
          <div className="flex flex-col gap-2">
            <Link
              to="/profile"
              onClick={closeMobileSidebar}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <UserIcon className="w-5 h-5 text-gray-800 shrink-0" />
              {(!collapsed || mobileSidebarOpen) && <span>Profile</span>}
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-gray-100 rounded-md text-left"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 shrink-0" />
              {(!collapsed || mobileSidebarOpen) && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
