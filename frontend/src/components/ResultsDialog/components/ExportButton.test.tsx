import { render, screen, fireEvent } from "@testing-library/react";
import ExportButton from "./ExportButton";
import TestResult from "@/schemas/TestResult";
import "@testing-library/jest-dom";

jest.mock("@/lib/urls/getExportTestResultUrl", () => jest.fn(() => "https://mocked-url.com"));

const mockTest = {
    id: "test-id",
    patient_id: "patient-id"
} as TestResult;

beforeEach(() => {
    window.open = jest.fn();
});

describe("ExportButton", () => {
    it("renders export button with correct label", () => {
        render(<ExportButton test={mockTest} />);
        expect(screen.getByRole("button", { name: "Експортувати у DOCX" })).toBeInTheDocument();
    });

    it("opens export url and shows snackbar on button click", async () => {
        render(<ExportButton test={mockTest} />);
        fireEvent.click(screen.getByRole("button", { name: "Експортувати у DOCX" }));
        expect(window.open).toHaveBeenCalledWith("https://mocked-url.com");
        expect(await screen.findByText("Файл експортовано")).toBeInTheDocument();
    });

    it("shows check icon after export", () => {
        render(<ExportButton test={mockTest} />);
        fireEvent.click(screen.getByRole("button", { name: "Експортувати у DOCX" }));
        expect(screen.getByTestId("CheckIcon")).toBeInTheDocument();
    });
})

