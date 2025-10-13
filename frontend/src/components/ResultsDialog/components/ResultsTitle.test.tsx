import { render, screen, fireEvent } from "@testing-library/react";
import ResultsTitle from "./ResultsTitle";
import TestBase from "@/types/models/TestBase";
import "@testing-library/jest-dom";

/* eslint-disable react/display-name */

jest.mock("@/components/DialogCloseButton", () => ({ onClose }: never) => (
    <button data-testid="close-btn" onClick={onClose}>close</button>
));

const mockTest: TestBase = {
    id: "test-123",
    name: "Test Name"
} as TestBase;

describe("ResultsTitle", () => {
    it("renders the test name as a link with correct href and target", () => {
        render(<ResultsTitle test={mockTest} onClose={jest.fn()} />);
        const link = screen.getByRole("link", { name: "Test Name" });
        expect(link).toHaveAttribute("href", "/dashboard/doctor/tests/test-123");
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveTextContent("Test Name");
    });

    it("calls onClose when close button is clicked", () => {
        const onClose = jest.fn();
        render(<ResultsTitle test={mockTest} onClose={onClose} />);
        fireEvent.click(screen.getByTestId("close-btn"));
        expect(onClose).toHaveBeenCalled();
    });

    it("renders nothing if test name is empty", () => {
        render(<ResultsTitle test={{ ...mockTest, name: "" }} onClose={jest.fn()} />);
        expect(screen.getByRole("link")).toBeEmptyDOMElement();
    });

    it("renders correct link even with special characters in test id", () => {
        render(<ResultsTitle test={{ ...mockTest, id: "id/with?special=chars" }} onClose={jest.fn()} />);
        expect(screen.getByRole("link")).toHaveAttribute("href", "/dashboard/doctor/tests/id/with?special=chars");
    });
});