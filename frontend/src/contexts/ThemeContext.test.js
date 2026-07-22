import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, THEME_STORAGE_KEY } from "./ThemeContext";
import { useTheme } from "../hooks/useTheme";

function ThemeProbe() {
  const { resolvedTheme, setTheme, theme } = useTheme();

  return (
    <div>
      <div>Theme: {theme}</div>
      <div>Resolved: {resolvedTheme}</div>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={() => setTheme("system")}>System</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to light theme", () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    expect(screen.getByText("Theme: light")).toBeInTheDocument();
    expect(screen.getByText("Resolved: light")).toBeInTheDocument();
    expect(document.documentElement).not.toHaveClass("dark");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("persists and applies an explicit dark theme", async () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    await userEvent.click(screen.getByText("Dark"));

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(screen.getByText("Theme: dark")).toBeInTheDocument();
    expect(screen.getByText("Resolved: dark")).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("dark");
  });

  it("falls back to light for unsupported theme values", async () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    await userEvent.click(screen.getByText("System"));

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(screen.getByText("Theme: light")).toBeInTheDocument();
  });
});
