import { authFetch } from "../Components/Auth/authFetch";
import { ApiError, parseJsonResponse } from "./apiClient";

async function requestLearningJson(path, options = {}) {
  const response = await authFetch(path, options);
  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw new ApiError(`Learning request failed with status ${response.status}`, {
      status: response.status,
      payload,
    });
  }

  return payload;
}

export function fetchLessonProgress(slug, options) {
  return requestLearningJson(`/learning/progress/${slug}/`, options);
}

export function fetchLessonBookmarks(options) {
  return requestLearningJson("/learning/bookmarks/", options);
}

export function fetchLessonCatalogProgress(options) {
  return requestLearningJson("/learning/catalog-progress/", options);
}

export function fetchLearningAchievements(options) {
  return requestLearningJson("/learning/achievements/", options);
}

export function fetchLearningXpProfile(options) {
  return requestLearningJson("/learning/xp/", options);
}

export function fetchLearningPaths(locale = "fa", options) {
  const params = new URLSearchParams({ locale });
  return requestLearningJson(`/learning/paths/?${params.toString()}`, options);
}

export function fetchRecommendedNextLesson(locale = "fa", options) {
  const params = new URLSearchParams({ locale });
  return requestLearningJson(`/learning/recommendation/?${params.toString()}`, options);
}

export function saveLessonBookmark(slug, options = {}) {
  return requestLearningJson(`/learning/bookmarks/${slug}/`, {
    ...options,
    method: "POST",
  });
}

export function removeLessonBookmark(slug, options = {}) {
  return requestLearningJson(`/learning/bookmarks/${slug}/`, {
    ...options,
    method: "DELETE",
  });
}

export function saveLessonProgress(slug, progress, options = {}) {
  return requestLearningJson(`/learning/progress/${slug}/`, {
    ...options,
    method: "PATCH",
    body: JSON.stringify(progress),
  });
}

export function saveQuizAttempt(slug, attempt, options = {}) {
  const { locale, ...requestOptions } = options;
  const params = locale ? `?${new URLSearchParams({ locale }).toString()}` : "";

  return requestLearningJson(`/learning/quiz-attempts/${slug}/${params}`, {
    ...requestOptions,
    method: "POST",
    body: JSON.stringify(attempt),
  });
}

export function saveLessonFeedback(slug, feedback, options = {}) {
  const { locale, ...requestOptions } = options;
  const params = locale ? `?${new URLSearchParams({ locale }).toString()}` : "";

  return requestLearningJson(`/learning/feedback/${slug}/${params}`, {
    ...requestOptions,
    method: "POST",
    body: JSON.stringify(feedback),
  });
}
