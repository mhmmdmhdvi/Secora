import { apiV1Url } from "./apiClient";

export async function fetchLesson(slug, locale = "en") {
  const params = new URLSearchParams({ locale });
  const response = await fetch(
    apiV1Url(`/lessons/${slug}/?${params.toString()}`)
  );

  if (!response.ok) {
    throw new Error(`Could not load lesson ${slug}: ${response.status}`);
  }

  const payload = await response.json();
  return payload.lesson;
}
