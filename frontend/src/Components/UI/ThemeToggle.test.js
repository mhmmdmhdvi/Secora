import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../../contexts/ThemeContext";
import ThemeToggle from "./ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders only light and dark choices", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(screen.getByRole("button", { name: "تم روشن" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "تم تاریک" })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("defaults to light and updates pressed state", async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const lightButton = screen.getByRole("button", { name: "تم روشن" });
    const darkButton = screen.getByRole("button", { name: "تم تاریک" });

    expect(lightButton).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(darkButton);

    expect(darkButton).toHaveAttribute("aria-pressed", "true");
    expect(lightButton).toHaveAttribute("aria-pressed", "false");
  });
});
