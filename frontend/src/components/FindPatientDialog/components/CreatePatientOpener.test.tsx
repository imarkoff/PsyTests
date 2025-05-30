import { render, screen, fireEvent } from "@testing-library/react";
import CreatePatientOpener from "./CreatePatientOpener";
import "@testing-library/jest-dom";

describe("CreatePatientOpener", () => {
    it("renders the prompt text", () => {
        const handleOpen = jest.fn();
        render(<CreatePatientOpener handleOpen={handleOpen} />);

        expect(screen.getByText("Не знайшли пацієнта?")).toBeInTheDocument();
    });

    it("renders the create button", () => {
        const handleOpen = jest.fn();
        render(<CreatePatientOpener handleOpen={handleOpen} />);

        expect(screen.getByText("Створити нового")).toBeInTheDocument();
    });

    it("calls handleOpen when button is clicked", () => {
        const handleOpen = jest.fn();
        render(<CreatePatientOpener handleOpen={handleOpen} />);

        fireEvent.click(screen.getByText("Створити нового"));

        expect(handleOpen).toHaveBeenCalledTimes(1);
    });

    it("does not call handleOpen when not clicked", () => {
        const handleOpen = jest.fn();
        render(<CreatePatientOpener handleOpen={handleOpen} />);

        expect(handleOpen).not.toHaveBeenCalled();
    });
});