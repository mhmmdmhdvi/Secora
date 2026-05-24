import React from "react";
import { Link } from "react-router-dom";

function LessonNotFound() {
  return (
    <div className="min-h-screen flex justify-center items-start pt-16 sm:pt-20 px-4">
      <div className="w-full max-w-md text-center px-6 sm:px-10 py-10 sm:py-12 rounded-2xl bg-gray-50">
        <h1 className="text-5xl sm:text-6xl font-bold mb-2">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
          Lesson Not Found
        </h2>

        <p className="text-gray-600 mb-6 text-sm sm:text-base leading-7">
          The lesson you're looking for doesn't exist or hasn't been created yet.
        </p>

        <Link
          to="/lessons"
          className="inline-block font-semibold text-blue-600 hover:underline"
        >
          ← Back to Lessons
        </Link>
      </div>
    </div>
  );
}

export default LessonNotFound;
