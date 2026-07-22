import { navigateTo } from "./navigation";

describe("navigation", () => {
  it("updates the URL and notifies router listeners without reloading", () => {
    const listener = jest.fn();
    window.addEventListener("popstate", listener);

    navigateTo("/lessons/sql-injection-guide");

    expect(window.location.pathname).toBe("/lessons/sql-injection-guide");
    expect(listener).toHaveBeenCalledTimes(1);

    window.removeEventListener("popstate", listener);
  });
});
