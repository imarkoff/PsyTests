import {render, screen, fireEvent} from "@testing-library/react";
import MarksDialogHeader from "./MarksDialogHeader";
import "@testing-library/jest-dom";
import {mockedTestBase} from "@/components/MarksDialog/mockedTestBase";

it("renders the header with test name and marks unit", () => {
    render(<MarksDialogHeader test={mockedTestBase} onClose={jest.fn()} />);

    expect(screen.getByText("Система оцінювання (points)")).toBeInTheDocument();
    expect(screen.getByText("Raven Test")).toBeInTheDocument();
});

it("renders the header without marks unit if not provided", () => {
    render(<MarksDialogHeader test={{...mockedTestBase, marks_unit: undefined}} onClose={jest.fn()} />);

    expect(screen.getByText("Система оцінювання")).toBeInTheDocument();
    expect(screen.queryByText("Система оцінювання ()")).not.toBeInTheDocument();
});

it("calls onClose when the close button is clicked", () => {
    const onClose = jest.fn();

    render(<MarksDialogHeader test={mockedTestBase} onClose={onClose} />);
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
});