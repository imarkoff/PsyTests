import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import MarksDialog from "../MarksDialog";
import {mockedTestBase} from "@/features/shared/psy-test-viewer/components/PsyTestMarksDialog/__tests__/mockedTestBase";
import "@testing-library/jest-dom";

jest.mock("@/features/shared/psy-test-viewer/components/PsyTestMarksDialog/components/MarksDialogHeader", () => ({
    __esModule: true,
    default: ({ onClose }: { onClose: () => void }) => (
        <div data-testid="mock-header">
            Mock Header
            <button onClick={onClose}>Close</button>
        </div>
    ),
}));

it("renders the button and does not show the dialog initially", () => {
    render(
        <MarksDialog test={mockedTestBase}>
            <div>Dialog Content</div>
        </MarksDialog>
    );

    expect(screen.getByText("Система оцінювання")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-header")).not.toBeInTheDocument();
});

it("opens the dialog when the button is clicked", () => {
    render(
        <MarksDialog test={mockedTestBase}>
            <div>Dialog Content</div>
        </MarksDialog>
    );
    fireEvent.click(screen.getByText("Система оцінювання"));

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByText("Dialog Content")).toBeInTheDocument();
});

it("closes the dialog when the header close button is clicked", async () => {
    render(
        <MarksDialog test={mockedTestBase}>
            <div>Dialog Content</div>
        </MarksDialog>
    );
    fireEvent.click(screen.getByText("Система оцінювання"));
    fireEvent.click(screen.getByText("Close"));

    await waitFor(() => {
        expect(screen.queryByTestId("mock-header")).not.toBeInTheDocument();
    });
});

it("renders children inside the dialog", () => {
    render(
        <MarksDialog test={mockedTestBase}>
            <span>Unique Child Content</span>
        </MarksDialog>
    );
    fireEvent.click(screen.getByText("Система оцінювання"));

    expect(screen.getByText("Unique Child Content")).toBeInTheDocument();
});