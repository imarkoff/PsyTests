import { render, screen, fireEvent } from "@testing-library/react";
import ResultsDialog from "./ResultsDialog";
import TestResult from "@/types/models/TestResult";
import "@testing-library/jest-dom";
import TestBase from "@/types/models/TestBase";

/* eslint-disable react/display-name */

jest.mock(
    "@/components/ResultsDialog/components/ResultsTitle",
    () => ({test}: {test: TestBase}) => (
        <div data-testid="results-title">{test.name}</div>
    )
);
jest.mock(
    "@/components/ResultsDialog/components/ResultsContent",
    () => ({testResult}: {testResult: TestResult}) => (
        <div data-testid="results-content">{testResult.id}</div>
    )
);

const mockTest: TestResult = {
    id: "result-1",
    patient_id: "patient-1",
    test: { id: "test-1", name: "Test Name", type: "raven" },
    results: { _: [] },
    verdict: null,
    passed_at: "2024-06-01T12:00:00Z"
};

describe("ResultsDialog", () => {
    it("renders show results button", () => {
        render(<ResultsDialog test={mockTest} />);
        expect(screen.getByRole("button", { name: "Показати результати" })).toBeInTheDocument();
    });

    it("opens dialog and renders title and content on button click", () => {
        render(<ResultsDialog test={mockTest} />);
        fireEvent.click(screen.getByRole("button", { name: "Показати результати" }));
        expect(screen.getByTestId("results-title")).toHaveTextContent("Test Name");
        expect(screen.getByTestId("results-content")).toHaveTextContent("result-1");
    });

    it("handles missing test name gracefully", () => {
        render(<ResultsDialog test={{ ...mockTest, test: { ...mockTest.test, name: "" } }} />);
        fireEvent.click(screen.getByRole("button", { name: "Показати результати" }));
        expect(screen.getByTestId("results-title")).toHaveTextContent("");
    });
})