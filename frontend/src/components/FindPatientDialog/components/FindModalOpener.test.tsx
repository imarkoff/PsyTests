import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FindModalOpener from "./FindModalOpener";

it("renders the chip with correct label and icon", () => {
    render(<FindModalOpener handleOpen={jest.fn()} />);

    expect(screen.getByText("Знайти пацієнта...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
});

it("calls handleOpen when chip is clicked", () => {
    const handleOpen = jest.fn();

    render(<FindModalOpener handleOpen={handleOpen} />);
    fireEvent.click(screen.getByRole("button"));

    expect(handleOpen).toHaveBeenCalledTimes(1);
});

it("does not throw if handleOpen is a no-op", () => {
    render(<FindModalOpener handleOpen={() => {}} />);

    expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();
});