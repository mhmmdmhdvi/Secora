import { apiV1Url, requestJson } from "./apiClient";

export async function fetchLesson(slug, locale = "en") {
  const params = new URLSearchParams({ locale });
  const payload = await requestJson(apiV1Url(`/lessons/${slug}/?${params.toString()}`));

  if (!payload?.lesson) {
    throw new Error(`Invalid lesson API response for ${slug}.`);
  }

  return payload.lesson;
}
