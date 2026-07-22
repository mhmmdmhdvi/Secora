import { render, screen } from "@testing-library/react";
import Button from "./Button";
import Callout from "./Callout";
import Card from "./Card";
import CodeBlock from "./CodeBlock";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import Field from "./Field";
import Skeleton from "./Skeleton";

describe("UI primitives", () => {
  it("renders accessible labeled fields", () => {
    render(<Field label="Email" id="email" />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("renders common presentation components", () => {
    render(
      <div>
        <Button>Save</Button>
        <Card>Card body</Card>
        <Callout title="Heads up">Check this</Callout>
        <CodeBlock filename="safe.py" code="print('ok')" />
        <EmptyState title="Nothing here" description="Try again later." />
        <ErrorState title="Broken">Could not load.</ErrorState>
        <Skeleton label="Loading card" />
      </div>
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByText("Card body")).toBeInTheDocument();
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("safe.py")).toBeInTheDocument();
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.getByText("Broken")).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Loading card" })).toBeInTheDocument();
  });
});
