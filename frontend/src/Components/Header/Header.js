import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white py-3 md:py-5 border-b border-gray-100">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[64px] md:min-h-[72px] flex items-center justify-between border border-gray-300 rounded-xl bg-white px-4 md:px-8">
          <div className="flex items-center gap-4 md:gap-7 min-w-0">
            <Link
              to="/"
              className="text-lg md:text-xl font-bold text-gray-900 no-underline whitespace-nowrap"
            >
              SecureLearn
            </Link>

            <nav className="flex items-center gap-4 md:gap-6 min-w-0">
              <Link
                to="/lessons"
                className="text-gray-600 text-sm md:text-base no-underline transition-colors duration-200 hover:text-black"
              >
                Lessons
              </Link>

              <a
                href="#"
                className="hidden sm:inline text-gray-600 text-sm md:text-base no-underline transition-colors duration-200 hover:text-black"
              >
                About
              </a>
            </nav>
          </div>

          <div className="ml-4 shrink-0">
            <Link
              to="/login"
              className="text-blue-600 font-semibold text-sm md:text-base no-underline hover:text-blue-700 transition-colors duration-200"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
