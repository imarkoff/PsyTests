import { render, screen } from "@testing-library/react";
import ResultsContent from "./ResultsContent";
import TestResult from "@/schemas/TestResult";
import "@testing-library/jest-dom";

// eslint-disable-next-line react/display-name
jest.mock("@/components/TestValues", () => ({ title, children }: never) => (
    <div data-testid="test-values">
        <span>{title}</span>
        <span>{children}</span>
    </div>
));
jest.mock("@/utils/formatDate", () => ({
    dateMed: jest.fn((date: string) => `formatted-${date}`)
}));
// eslint-disable-next-line react/display-name
jest.mock("@/components/ResultsDialog/components/ExportButton", () => ({ }: never) => (
    <button data-testid="export-btn">Export</button>
));

const ContentMock = jest.fn(({ test }) => <div data-testid="content-mock">{test.id}</div>);
const FooterMock = jest.fn(({ test }) => <div data-testid="footer-mock">{test.id}</div>);


jest.mock("@/features/tests/config", () => ({
    __esModule: true,
    default: {
        "raven": {
            results: {
                /* eslint-disable @typescript-eslint/no-explicit-any */
                content: (props: any) => <ContentMock {...props} />,
                footer: (props: any) => <FooterMock {...props} />
                /* eslint-enable */
            }
        },
        "mmpi": {
            results: {}
        }
    }
}));

const baseTestResult: TestResult<null> = {
    id: "f74510e0-281d-4b3d-9a31-cecb382cfad7",
    patient_id: "f74510e0-281d-4b3d-9a31-cecb382cfad7",
    test: {
        id: "f74510e0-281d-4b3d-9a31-cecb382cfad7",
        name: "Test 1",
        type: "raven"
    },
    results: { "_": [1, 2, 2], "result-1": [3] },
    verdict: null,
    passed_at: "2024-06-01T12:00:00Z"
};

describe("ResultsContent", () => {
    it("renders content, footer, date and export button for test with content and footer", () => {
        render(<ResultsContent testResult={baseTestResult} />);
        expect(screen.getByTestId("content-mock")).toHaveTextContent(baseTestResult.id);
        expect(screen.getByTestId("footer-mock")).toHaveTextContent(baseTestResult.id);
        expect(screen.getByTestId("test-values")).toHaveTextContent("Дата проходження");
        expect(screen.getByTestId("test-values")).toHaveTextContent("formatted-2024-06-01T12:00:00Z");
        expect(screen.getByTestId("export-btn")).toBeInTheDocument();
    });

    it("renders only date and export button when no content or footer is defined", () => {
        const testResult: TestResult = { ...baseTestResult, test: { ...baseTestResult.test, type: "mmpi" } };
        render(<ResultsContent testResult={testResult} />);
        expect(screen.queryByTestId("content-mock")).not.toBeInTheDocument();
        expect(screen.queryByTestId("footer-mock")).not.toBeInTheDocument();
        expect(screen.getByTestId("test-values")).toHaveTextContent("Дата проходження");
        expect(screen.getByTestId("export-btn")).toBeInTheDocument();
    });

    it("handles missing passed_at gracefully", () => {
        render(<ResultsContent testResult={{ ...baseTestResult, passed_at: undefined as any }} />);
        expect(screen.getByTestId("test-values")).toHaveTextContent("formatted-undefined");
    });
});