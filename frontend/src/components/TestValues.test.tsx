import { render, screen } from "@testing-library/react";
import TestValues from "./TestValues";
import "@testing-library/jest-dom";

describe("TestValues", () => {
    it("renders title and children as strings", () => {
        render(<TestValues title="Username">john_doe</TestValues>);
        expect(screen.getByText(/Username:/)).toBeInTheDocument();
        expect(screen.getByText("john_doe")).toBeInTheDocument();
    });

    it("renders title and children as React nodes", () => {
        render(
            <TestValues title={<span data-testid="custom-title">Custom Title</span>}>
                <span data-testid="custom-value">Custom Value</span>
            </TestValues>
        );
        expect(screen.getByTestId("custom-title")).toBeInTheDocument();
        expect(screen.getByTestId("custom-value")).toBeInTheDocument();
    });

    it("renders colon after the title", () => {
        render(<TestValues title="Label">Value</TestValues>);
        expect(screen.getByText(/Label:/)).toBeInTheDocument();
    });
});