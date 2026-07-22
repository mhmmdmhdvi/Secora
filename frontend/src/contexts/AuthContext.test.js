import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "./AuthContext";
import { useAuth } from "../hooks/useAuth";
import { clearAuthTokens } from "../services/authTokens";

function AuthProbe() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      <div>{isAuthenticated ? "Authenticated" : "Anonymous"}</div>
      <button onClick={() => login({ access: "access-token", refresh: "refresh-token" })}>
        Log in
      </button>
      <button onClick={logout}>Log out</button>
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    clearAuthTokens();
  });

  it("tracks login and logout state", async () => {
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    expect(screen.getByText("Anonymous")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Log in"));

    expect(screen.getByText("Authenticated")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Log out"));

    expect(screen.getByText("Anonymous")).toBeInTheDocument();
  });
});
