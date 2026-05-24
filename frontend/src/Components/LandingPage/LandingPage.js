import React from "react";
import TerminalBox from "./TerminalBox";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="bg-white text-[#222]">
      <section className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16 xl:gap-24">
            {/* LEFT SIDE */}
            <div className="flex flex-col justify-center items-start text-left lg:items-start lg:text-left">
              <h1 className="font-extrabold leading-tight text-4xl sm:text-5xl xl:text-6xl text-[#111] m-0">
                Learn the attacks
              </h1>

              <h2 className="font-extrabold leading-tight text-4xl sm:text-5xl xl:text-6xl text-[#1f6feb] mt-2 mb-6">
                Defend your code
              </h2>

              <p className="text-sm sm:text-base text-gray-500 leading-7 mb-8 max-w-xl">
                Free interactive secure code lessons covering the OWASP Top 10
                and emerging AI vulnerabilities. Learn how to prevent SQL
                injection, prompt injection, cross-site scripting, and more real
                world attacks. Expert-written, 15-30 minutes each.
              </p>

              <Link
                to="/lessons"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Browse All Lessons
              </Link>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex justify-center items-center">
              <TerminalBox />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
