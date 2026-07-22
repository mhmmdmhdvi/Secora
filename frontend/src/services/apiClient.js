const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
const API_VERSION_PREFIX = "/api/v1";

export class ApiError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export function apiV1Url(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return apiUrl(`${API_VERSION_PREFIX}${normalizedPath}`);
}

export async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, {
      status: response.status,
      payload,
    });
  }

  return payload;
}

export function getApiErrorMessage(error, fallback = "Something went wrong") {
  if (error?.name === "AbortError") {
    return null;
  }

  const payload = error instanceof ApiError ? error.payload : error?.payload;

  if (payload) {
    const message = findFirstPayloadMessage(payload);

    if (message) {
      return message;
    }
  }

  return fallback;
}

export async function getResponseErrorMessage(response, fallback) {
  const payload = await parseJsonResponse(response);

  return getApiErrorMessage(
    new ApiError(`Request failed with status ${response.status}`, {
      status: response.status,
      payload,
    }),
    fallback
  );
}

function findFirstPayloadMessage(value) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(findFirstPayloadMessage).find(Boolean) || null;
  }

  if (typeof value === "object") {
    for (const key of ["detail", "error", "message", "non_field_errors"]) {
      const message = findFirstPayloadMessage(value[key]);

      if (message) {
        return message;
      }
    }

    for (const fieldValue of Object.values(value)) {
      const message = findFirstPayloadMessage(fieldValue);

      if (message) {
        return message;
      }
    }
  }

  return null;
}
