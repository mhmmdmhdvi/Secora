import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RouteErrorBoundary from "./RouteErrorBoundary";

function ThrowError() {
  throw new Error("Broken route");
}

describe("RouteErrorBoundary", () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("renders a recovery UI when a child route fails", () => {
    render(
      <RouteErrorBoundary resetKey="/broken">
        <ThrowError />
      </RouteErrorBoundary>
    );

    expect(screen.getByText("مشکلی پیش آمد")).toBeInTheDocument();
    expect(screen.getByText("تلاش دوباره")).toBeInTheDocument();
  });

  it("can retry after a route failure", async () => {
    const { rerender } = render(
      <RouteErrorBoundary resetKey="/broken">
        <ThrowError />
      </RouteErrorBoundary>
    );

    await userEvent.click(screen.getByText("تلاش دوباره"));

    rerender(
      <RouteErrorBoundary resetKey="/fixed">
        <div>Recovered route</div>
      </RouteErrorBoundary>
    );

    expect(screen.getByText("Recovered route")).toBeInTheDocument();
  });
});
