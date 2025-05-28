import { render, screen } from "@testing-library/react";
import TestHistoryCard from "./TestHistoryCard";
import TestResult from "@/schemas/TestResult";
import testsConfig from "@/features/tests/config";
import * as formatDate from "@/utils/formatDate";
import TestBase from "@/schemas/TestBase";
import TestConfigType from "@/features/tests/TestConfig";
import "@testing-library/jest-dom";

jest.mock(
    "@/components/ResultsDialog/ResultsDialog",
    () => {
        const MockResultsDialog =
            ({ }: { test: TestResult }) => <div data-testid="results-dialog" />;
        MockResultsDialog.displayName = "MockResultsDialog";
        return MockResultsDialog;
    }
);

const mockTest: TestResult = {
    id: "a2fac5ba-3344-44f3-811a-fd2b7104d1c0",
    patient_id: "a2fac5ba-3344-44f3-811a-fd2b7104d1c0",
    test: {
        id: "a2fac5ba-3344-44f3-811a-fd2b7104d1c0",
        name: "Sample Test",
        type: "raven"
    },
    results: { "_": [] },
    verdict: null,
    passed_at: "2024-06-01T12:00:00Z"
};

describe("TestHistoryCard", () => {
    it("renders test name in card header", () => {
        render(<TestHistoryCard test={mockTest} />);
        expect(screen.getByText("Sample Test")).toBeInTheDocument();
    });

    it("renders formatted date in TestValues", () => {
        jest.spyOn(formatDate, "dateMed").mockReturnValue("01.06.2024");
        render(<TestHistoryCard test={mockTest} />);
        expect(screen.getByText(/Дата проходження:/)).toBeInTheDocument();
        expect(screen.getByText("01.06.2024")).toBeInTheDocument();
    });

    it("renders ResultsDialog in card actions", () => {
        render(<TestHistoryCard test={mockTest} />);
        expect(screen.getByTestId("results-dialog")).toBeInTheDocument();
    });

    it("renders Content component if present in testsConfig", () => {
        const ContentMock = ({ test }: { test: TestResult }) =>
            <div data-testid="custom-content">{test.test.name}</div>;
        testsConfig["raven"] = { results: { card: ContentMock } } as TestConfigType<TestBase, TestResult>;
        render(<TestHistoryCard test={mockTest} />);
        expect(screen.getByTestId("custom-content")).toHaveTextContent("Sample Test");
    });

    it("does not render Content component if not present in testsConfig", () => {
        testsConfig["raven"] = { results: {} } as TestConfigType<TestBase, TestResult<object>>;
        render(<TestHistoryCard test={mockTest} />);
        expect(screen.queryByTestId("custom-content")).not.toBeInTheDocument();
    });
})

