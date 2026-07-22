const ACCESS_TOKEN_KEY = "access";
const REFRESH_TOKEN_KEY = "refresh";

const subscribers = new Set();

function notifySubscribers() {
  subscribers.forEach((subscriber) => subscriber(getAuthTokens()));
}

export function getAuthTokens() {
  return {
    access: localStorage.getItem(ACCESS_TOKEN_KEY),
    refresh: localStorage.getItem(REFRESH_TOKEN_KEY),
  };
}

export function hasAuthTokens() {
  return Boolean(getAuthTokens().access);
}

export function setAuthTokens({ access, refresh }) {
  if (access) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
  }

  if (refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }

  notifySubscribers();
}

export function clearAuthTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  notifySubscribers();
}

export function subscribeToAuthTokens(subscriber) {
  subscribers.add(subscriber);
  return () => subscribers.delete(subscriber);
}

export function isAuthTokenStorageKey(key) {
  return key === ACCESS_TOKEN_KEY || key === REFRESH_TOKEN_KEY;
}
