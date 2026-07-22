export function navigateTo(path) {
  if (!path || path === window.location.pathname) {
    return;
  }

  window.history.pushState({}, "", path);
  const event =
    typeof PopStateEvent === "function"
      ? new PopStateEvent("popstate")
      : new Event("popstate");

  window.dispatchEvent(event);
}
