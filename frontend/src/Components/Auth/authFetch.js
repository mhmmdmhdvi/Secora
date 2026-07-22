import { apiV1Url } from "../../services/apiClient";
import {
  clearAuthTokens,
  getAuthTokens,
  setAuthTokens,
} from "../../services/authTokens";

let refreshAccessTokenPromise = null;

export async function authFetch(url, options = {}) {
  const { access, refresh } = getAuthTokens();
  const requestUrl = apiV1Url(url);

  options.headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${access}`,
  };

  let response = await fetch(requestUrl, options);

  if (response.status === 401 && refresh) {
    const newAccessToken = await refreshAccessToken(refresh);

    if (newAccessToken) {
      options.headers.Authorization = `Bearer ${newAccessToken}`;
      response = await fetch(requestUrl, options);
    }
  }

  return response;
}

async function refreshAccessToken(refresh) {
  if (!refreshAccessTokenPromise) {
    refreshAccessTokenPromise = fetch(apiV1Url("/token/refresh/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    })
      .then(async (refreshResponse) => {
        if (!refreshResponse.ok) {
          clearAuthTokens();
          return null;
        }

        const data = await refreshResponse.json();
        setAuthTokens({ access: data.access });
        return data.access;
      })
      .finally(() => {
        refreshAccessTokenPromise = null;
      });
  }

  return refreshAccessTokenPromise;
}
