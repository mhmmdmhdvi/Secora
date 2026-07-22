import {
  ApiError,
  apiUrl,
  apiV1Url,
  getApiErrorMessage,
  requestJson,
} from "./apiClient";

describe("apiClient", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("builds relative API URLs by default", () => {
    expect(apiUrl("/health/")).toBe("/health/");
    expect(apiV1Url("/accounts/register/")).toBe("/api/v1/accounts/register/");
  });

  it("accepts paths without leading slashes", () => {
    expect(apiUrl("health/")).toBe("/health/");
    expect(apiV1Url("token/")).toBe("/api/v1/token/");
  });

  it("extracts useful messages from API error payloads", () => {
    const error = new ApiError("Bad request", {
      status: 400,
      payload: {
        password: ["This password is too short."],
      },
    });

    expect(getApiErrorMessage(error, "Fallback")).toBe(
      "This password is too short."
    );
  });

  it("throws ApiError for failed JSON requests", async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ detail: "Nope" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    );

    await expect(requestJson("/api/v1/example/")).rejects.toMatchObject({
      name: "ApiError",
      status: 403,
      payload: { detail: "Nope" },
    });
  });
});
