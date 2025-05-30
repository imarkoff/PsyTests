import { render, screen } from "@testing-library/react";
import QuestionCardHeader from "./QuestionCardHeader";
import * as QuestionCardContext from "@/components/QuestionCard/context/QuestionCardContext";
import "@testing-library/jest-dom";
import {mockedContext} from "@/components/QuestionCard/context/mockedContext";

jest.mock("@/components/QuestionCard/context/QuestionCardContext");

beforeEach(() => {
    jest.spyOn(QuestionCardContext, "useQuestionCardContext").mockReturnValue(mockedContext);
});

describe("QuestionCardHeader", () => {
    it("renders title with moduleName, index incremented by one, and title", () => {
        jest.spyOn(QuestionCardContext, "useQuestionCardContext").mockReturnValue({
            ...mockedContext,
            moduleName: "math",
            index: 0,
        });

        render(<QuestionCardHeader title="Addition" />);

        expect(screen.getByText("math 1. Addition")).toBeInTheDocument();
    });

    it("renders title with empty moduleName and title if not provided", () => {
        jest.spyOn(QuestionCardContext, "useQuestionCardContext").mockReturnValue({
            ...mockedContext,
            moduleName: undefined,
            index: 2,
            error: undefined,
        });

        render(<QuestionCardHeader />);

        expect(screen.getByText("3.")).toBeInTheDocument();
    });

    it("shows subheader when error is present", () => {
        jest.spyOn(QuestionCardContext, "useQuestionCardContext").mockReturnValue({
            ...mockedContext,
            error: "some error" as never,
        });

        render(<QuestionCardHeader title="Subtraction" />);

        expect(screen.getByText("Оберіть відповідь")).toBeInTheDocument();
    });

    it("does not show subheader when error is not present", () => {
        render(<QuestionCardHeader title="Multiplication" />);

        expect(screen.queryByText("Оберіть відповідь")).toBeNull();
    });
});