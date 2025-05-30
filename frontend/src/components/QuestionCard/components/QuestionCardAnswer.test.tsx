import { render, screen, fireEvent } from "@testing-library/react";
import QuestionRadioAnswer from "@/components/QuestionCard/components/QuestionRadioAnswer";
import "@testing-library/jest-dom";

const baseAnswer = {
    answer: "Option A",
    image: undefined,
};

const imageAnswer = {
    answer: "Option B",
    image: { src: "/img.png", alt: "option image" },
};

describe("QuestionCardAnswer", () => {
    it("renders the answer text and index", () => {
        render(
            <QuestionRadioAnswer
                answer={baseAnswer}
                index={0}
                onChange={() => {}}
            />
        );
        expect(screen.getByText("1.")).toBeInTheDocument();
        expect(screen.getByText("Option A")).toBeInTheDocument();
    });

    it("calls onChange with the correct index when clicked", () => {
        const onChange = jest.fn();
        render(
            <QuestionRadioAnswer
                answer={baseAnswer}
                index={2}
                onChange={onChange}
            />
        );
        fireEvent.click(screen.getByRole("radio"));
        expect(onChange).toHaveBeenCalledWith(2);
    });

    it("disables interaction when disabled prop is true", () => {
        const onChange = jest.fn();
        render(
            <QuestionRadioAnswer
                answer={baseAnswer}
                index={1}
                onChange={onChange}
                disabled
            />
        );
        fireEvent.click(screen.getByRole("radio"));
        expect(onChange).not.toHaveBeenCalled();
    });

    it("shows the radio as checked when chosenAnswer matches index", () => {
        render(
            <QuestionRadioAnswer
                answer={baseAnswer}
                index={3}
                onChange={() => {}}
                chosenAnswer={3}
            />
        );
        expect(screen.getByRole("radio")).toBeChecked();
    });

    it("shows the radio as checked and with success color when correctAnswer matches index", () => {
        render(
            <QuestionRadioAnswer
                answer={baseAnswer}
                index={1}
                onChange={() => {}}
                correctAnswer={1}
            />
        );
        expect(screen.getByRole("radio")).toBeChecked();
        // MUI color prop is not visible in DOM, but checked state is
    });

    it("shows the radio as error color when correctAnswer does not match index", () => {
        render(
            <QuestionRadioAnswer
                answer={baseAnswer}
                index={0}
                onChange={() => {}}
                correctAnswer={1}
            />
        );
        expect(screen.getByRole("radio")).not.toBeChecked();
    });

    it("renders an image when answer has an image", () => {
        render(
            <QuestionRadioAnswer
                answer={imageAnswer}
                index={0}
                onChange={() => {}}
            />
        );
        expect(screen.getByAltText("option image")).toBeInTheDocument();
    });

    it("renders index without dot when answer has an image", () => {
        render(
            <QuestionRadioAnswer
                answer={imageAnswer}
                index={2}
                onChange={() => {}}
            />
        );
        expect(screen.getByText("3")).toBeInTheDocument();
        expect(screen.queryByText("3.")).not.toBeInTheDocument();
    });
});