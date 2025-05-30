import { render, screen, fireEvent } from "@testing-library/react";
import DialogCloseButton from "./DialogCloseButton";
import "@testing-library/jest-dom";

describe("DialogCloseButton", () => {
    it("renders the close icon button", () => {
        render(<DialogCloseButton onClose={jest.fn()} />);
        const button = screen.getByRole("button", { name: /close/i });
        expect(button).toBeInTheDocument();
    });

    it("calls onClose when clicked", () => {
        const onClose = jest.fn();
        render(<DialogCloseButton onClose={onClose} />);
        const button = screen.getByRole("button", { name: /close/i });
        fireEvent.click(button);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("has the correct title attribute", () => {
        render(<DialogCloseButton onClose={jest.fn()} />);
        const button = screen.getByTitle("Закрити");
        expect(button).toBeInTheDocument();
    });
});