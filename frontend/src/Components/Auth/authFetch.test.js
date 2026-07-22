import { authFetch } from "./authFetch";
import { clearAuthTokens, setAuthTokens } from "../../services/authTokens";

describe("authFetch", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    clearAuthTokens();
    setAuthTokens({ access: "expired-access", refresh: "valid-refresh" });
  });

  afterEach(() => {
    clearAuthTokens();
    global.fetch = originalFetch;
  });

  it("refreshes an expired access token only once for concurrent requests", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access: "fresh-access" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    const [firstResponse, secondResponse] = await Promise.all([
      authFetch("/accounts/change-password/", { method: "POST" }),
      authFetch("/accounts/delete-account/", { method: "DELETE" }),
    ]);

    expect(firstResponse.ok).toBe(true);
    expect(secondResponse.ok).toBe(true);

    const refreshCalls = global.fetch.mock.calls.filter(
      ([url]) => url === "/api/v1/token/refresh/"
    );

    expect(refreshCalls).toHaveLength(1);

    const retryCalls = global.fetch.mock.calls.slice(3);
    expect(retryCalls[0][1].headers.Authorization).toBe("Bearer fresh-access");
    expect(retryCalls[1][1].headers.Authorization).toBe("Bearer fresh-access");
  });
});
