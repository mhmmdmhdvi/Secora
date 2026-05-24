import React from "react";
import { useParams } from "react-router-dom";
import lessonComponents from "./index";
import LessonNotFound from "./LessonNotFound";

function LessonLoader() {
  const { slug } = useParams();

  const LessonComponent = lessonComponents[slug];

  if (!LessonComponent) {
    return <LessonNotFound />;
  }

  return <LessonComponent />;
}

export default LessonLoader;
