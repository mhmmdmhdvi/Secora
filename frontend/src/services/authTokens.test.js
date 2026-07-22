import {
  clearAuthTokens,
  getAuthTokens,
  hasAuthTokens,
  setAuthTokens,
  subscribeToAuthTokens,
} from "./authTokens";

describe("authTokens", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores, reads, and clears auth tokens", () => {
    expect(hasAuthTokens()).toBe(false);

    setAuthTokens({ access: "access-token", refresh: "refresh-token" });

    expect(hasAuthTokens()).toBe(true);
    expect(getAuthTokens()).toEqual({
      access: "access-token",
      refresh: "refresh-token",
    });

    clearAuthTokens();

    expect(hasAuthTokens()).toBe(false);
    expect(getAuthTokens()).toEqual({
      access: null,
      refresh: null,
    });
  });

  it("notifies subscribers when token state changes", () => {
    const subscriber = jest.fn();
    const unsubscribe = subscribeToAuthTokens(subscriber);

    setAuthTokens({ access: "access-token" });
    clearAuthTokens();
    unsubscribe();
    setAuthTokens({ access: "after-unsubscribe" });

    expect(subscriber).toHaveBeenCalledTimes(2);
    expect(subscriber).toHaveBeenNthCalledWith(1, {
      access: "access-token",
      refresh: null,
    });
    expect(subscriber).toHaveBeenNthCalledWith(2, {
      access: null,
      refresh: null,
    });
  });
});
