import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FindInput from "./FindInput";

describe("FindInput", () => {
    it("renders input with placeholder text", () => {
        const mockSetQuery = jest.fn();
        const mockRef = { current: null };

        render(<FindInput searchRef={mockRef} setQuery={mockSetQuery} loading={false} />);

        expect(screen.getByPlaceholderText("Введіть ініціали пацієнта або його номер")).toBeInTheDocument();
    });

    it("calls setQuery when input value changes", () => {
        const mockSetQuery = jest.fn();
        const mockRef = { current: null };

        render(<FindInput searchRef={mockRef} setQuery={mockSetQuery} loading={false} />);

        const input = screen.getByPlaceholderText("Введіть ініціали пацієнта або його номер");
        fireEvent.change(input, { target: { value: "John" } });

        expect(mockSetQuery).toHaveBeenCalledWith("John");
    });

    it("shows loading indicator when loading is true", () => {
        const mockSetQuery = jest.fn();
        const mockRef = { current: null };

        render(<FindInput searchRef={mockRef} setQuery={mockSetQuery} loading={true} />);

        const loadingIndicator = screen.getByRole("progressbar");
        const computedStyle = window.getComputedStyle(loadingIndicator);

        expect(loadingIndicator).toBeInTheDocument();
        expect(computedStyle.visibility).not.toBe("collapse");
    });

    it("hides loading indicator when loading is false", () => {
        const mockSetQuery = jest.fn();
        const mockRef = { current: null };

        render(<FindInput searchRef={mockRef} setQuery={mockSetQuery} loading={false} />);

        const loadingIndicator = screen.getByRole("progressbar");
        const computedStyle = window.getComputedStyle(loadingIndicator);

        expect(loadingIndicator).toBeInTheDocument();
        expect(computedStyle.visibility).toBe("collapse");
    });

    it("applies ref to input element", () => {
        const mockSetQuery = jest.fn();
        const mockRef = { current: null };

        render(<FindInput searchRef={mockRef} setQuery={mockSetQuery} loading={false} />);

        expect(mockRef.current).not.toBeNull();
        expect(mockRef.current as unknown instanceof HTMLInputElement).toBe(true);
    });
});