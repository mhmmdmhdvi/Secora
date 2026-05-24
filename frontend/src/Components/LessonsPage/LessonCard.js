import { Link } from "react-router-dom";
import React from "react";

function LessonCard({ id, image, title, description }) {
  return (
    <div
      className="
        w-full max-w-sm min-h-[420px]
        border border-[#e6e6e6] rounded-2xl bg-gray-200
        flex flex-col items-center text-center
        px-5 sm:px-6 py-6 sm:py-8
        transition-all duration-200
        hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]
      "
    >
      <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 flex items-center justify-center mb-5">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain rounded-2xl"
        />
      </div>

      <h3 className="text-lg sm:text-xl font-semibold mb-3">
        {title}
      </h3>

      <p className="text-sm sm:text-[0.95rem] text-[#555] mb-5 max-w-[260px] leading-6 line-clamp-3">
        {description}
      </p>

      <Link
        to={`/lessons/${id}`}
        className="mt-auto text-sm sm:text-[0.95rem] font-medium text-blue-600 underline hover:text-blue-700"
      >
        Explore Lesson →
      </Link>
    </div>
  );
}

export default LessonCard;
