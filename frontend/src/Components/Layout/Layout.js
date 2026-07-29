import React, { useState, useEffect } from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import AppBreadcrumbs, { useCurrentBreadcrumbLabel } from "./AppBreadcrumbs";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { useAppLanguage } from "../../hooks/useAppLanguage";

function Layout({ children }) {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { language } = useAppLanguage();
  const isRtl = language === "fa";
  const mobileBreadcrumbLabel = useCurrentBreadcrumbLabel();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-app text-text">
      {isAuthenticated ? (
        <>
          {/* Mobile top bar */}
          <div className="md:hidden fixed top-0 left-0 right-0 h-[72px] bg-surface border-b border-border flex items-center justify-between gap-4 px-4 z-40">
            <h1
              className="min-w-0 truncate text-lg font-bold text-text"
              dir={isRtl ? "rtl" : "ltr"}
              title={mobileBreadcrumbLabel}
            >
              {mobileBreadcrumbLabel}
            </h1>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="shrink-0 text-text-muted hover:text-text"
              aria-label={t("nav.openMenu")}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>

          <Sidebar
            collapsed={collapsed}
            isRtl={isRtl}
            setCollapsed={setCollapsed}
            mobileSidebarOpen={mobileSidebarOpen}
            setMobileSidebarOpen={setMobileSidebarOpen}
          />

          <main
            className={`
              transition-all duration-300
              pt-[72px] md:pt-0 px-4 sm:px-6 lg:px-8
              ${collapsed ? (isRtl ? "md:mr-16" : "md:ml-16") : (isRtl ? "md:mr-56" : "md:ml-56")}
            `}
          >
            <AppBreadcrumbs />
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
