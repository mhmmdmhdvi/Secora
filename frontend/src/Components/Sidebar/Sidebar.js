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
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";

function Sidebar({
  collapsed,
  isRtl = false,
  setCollapsed,
  mobileSidebarOpen,
  setMobileSidebarOpen,
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
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
          fixed top-0 z-50 md:z-30 h-full bg-surface border-border shadow-md
          transition-all duration-300 flex flex-col
          ${collapsed ? "md:w-16" : "md:w-56"}
          w-64
          ${isRtl ? "right-0 border-l" : "left-0 border-r"}
          ${mobileSidebarOpen ? "translate-x-0" : isRtl ? "translate-x-full" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Top */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-border min-h-[64px]">
          {(!collapsed || mobileSidebarOpen) && (
            <h1 className="text-lg font-bold text-text">SecureLearn</h1>
          )}

          {/* Desktop collapse button */}
          <button
            className="hidden md:block text-text-muted hover:text-text"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? t("nav.expandSidebar") : t("nav.collapseSidebar")}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          {/* Mobile close button */}
          <button
            className="md:hidden text-text-muted hover:text-text"
            onClick={closeMobileSidebar}
            aria-label={t("nav.closeMenu")}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col mt-6 gap-2 px-2 flex-1">
          <Link
            to="/"
            onClick={closeMobileSidebar}
            className="flex items-center gap-3 px-4 py-3 text-text-muted hover:bg-surface-muted hover:text-text rounded-md"
          >
            <HomeIcon className="w-5 h-5 shrink-0" />
            {(!collapsed || mobileSidebarOpen) && <span>{t("nav.home")}</span>}
          </Link>

          <Link
            to="/lessons"
            onClick={closeMobileSidebar}
            className="flex items-center gap-3 px-4 py-3 text-text-muted hover:bg-surface-muted hover:text-text rounded-md"
          >
            <BookOpenIcon className="w-5 h-5 shrink-0" />
            {(!collapsed || mobileSidebarOpen) && <span>{t("nav.lessons")}</span>}
          </Link>
        </nav>

        {/* Bottom */}
        <div className="border-t border-border px-2 py-4">
          <div className="flex flex-col gap-2">
            <Link
              to="/profile"
              onClick={closeMobileSidebar}
              className="flex items-center gap-3 px-4 py-3 text-text-muted hover:bg-surface-muted hover:text-text rounded-md"
            >
              <UserIcon className="w-5 h-5 shrink-0" />
              {(!collapsed || mobileSidebarOpen) && <span>{t("nav.profile")}</span>}
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-danger hover:bg-surface-muted rounded-md text-start"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 shrink-0" />
              {(!collapsed || mobileSidebarOpen) && <span>{t("nav.logout")}</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
