export async function authFetch(url, options = {}) {
  let access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  options.headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${access}`,
  };

  let response = await fetch(url, options);

  // If access token expired
  if (response.status === 401 && refresh) {
    const refreshResponse = await fetch("/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();

      // Save new access token
      localStorage.setItem("access", data.access);

      // Retry original request with new token
      options.headers.Authorization = `Bearer ${data.access}`;
      response = await fetch(url, options);
    } else {
      // Refresh failed → logout
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
    }
  }

  return response;
}
