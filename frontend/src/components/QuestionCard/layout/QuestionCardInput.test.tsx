import { render, screen, fireEvent } from "@testing-library/react";
import QuestionCardInput from "@/components/QuestionCard/layout/QuestionCardInput";
import { useQuestionCardContext } from "@/components/QuestionCard/context/QuestionCardContext";
import "@testing-library/jest-dom";

jest.mock("@/components/QuestionCard/context/QuestionCardContext");

describe("QuestionCardInput", () => {
    it("calls handleAnswerChange with input value when changed", () => {
        const handleAnswerChange = jest.fn();
        (useQuestionCardContext as jest.Mock).mockReturnValue({ handleAnswerChange });

        render(<QuestionCardInput />);
        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "new answer" } });

        expect(handleAnswerChange).toHaveBeenCalledWith("new answer");
    });

    it("renders input as disabled when disabled prop is true", () => {
        (useQuestionCardContext as jest.Mock).mockReturnValue({ handleAnswerChange: jest.fn() });

        render(<QuestionCardInput disabled />);
        const input = screen.getByRole("textbox");
        expect(input).toBeDisabled();
    });

    it("renders input as enabled when disabled prop is false", () => {
        (useQuestionCardContext as jest.Mock).mockReturnValue({ handleAnswerChange: jest.fn() });

        render(<QuestionCardInput disabled={false} />);
        const input = screen.getByRole("textbox");

        expect(input).not.toBeDisabled();
    });

    it("renders input as enabled when disabled prop is not provided", () => {
        (useQuestionCardContext as jest.Mock).mockReturnValue({ handleAnswerChange: jest.fn() });

        render(<QuestionCardInput />);
        const input = screen.getByRole("textbox");

        expect(input).not.toBeDisabled();
    });
});