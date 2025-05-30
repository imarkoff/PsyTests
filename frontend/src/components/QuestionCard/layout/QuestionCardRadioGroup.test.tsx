import { render, screen } from "@testing-library/react";
import QuestionCardRadioGroup from "@/components/QuestionCard/layout/QuestionCardRadioGroup";
import { useQuestionCardContext } from "@/components/QuestionCard/context/QuestionCardContext";
import RadioAnswer from "@/components/QuestionCard/types/RadioAnswer";
import "@testing-library/jest-dom";

/* eslint-disable react/display-name */

jest.mock("@/components/QuestionCard/context/QuestionCardContext");

jest.mock("@/components/QuestionCard/components/QuestionRadioAnswer", () => (
    { answer, correctAnswer,
        disabled }: { disabled: boolean, answer: RadioAnswer, onChange: (value: string) => void, correctAnswer?: number | string
    }) => (
        <div>
            <span>{answer.answer}</span>
            <input
                type="radio"
                value={answer.value}

                defaultChecked={correctAnswer === answer.value}
                disabled={disabled}
            />
        </div>

    )
);

const mockAnswers: RadioAnswer[] = [
    { answer: "Option 1", value: 1 },
    { answer: "Option 2", value: 2 },
];

beforeEach(() => {
    jest.clearAllMocks();
    (useQuestionCardContext as jest.Mock).mockReturnValue({
        index: 0,
        chosenAnswer: undefined,
        handleAnswerChange: jest.fn(),
    });
});

describe('QuestionCardRadioGroup', () => {
    it("renders all provided answers as radio options", () => {
        render(<QuestionCardRadioGroup answers={mockAnswers} />);

        expect(screen.getByText("Option 1")).toBeInTheDocument();
        expect(screen.getByText("Option 2")).toBeInTheDocument();
    });

    it("applies the correct justifyContent style based on align prop", () => {
        render(<QuestionCardRadioGroup answers={mockAnswers} align="right" />);

        const radioGroup = screen.getByRole("radiogroup");

        expect(radioGroup).toHaveStyle({ justifyContent: "right" });
    });

    it("selects the correct radio by default when correctAnswer is provided", () => {
        render(<QuestionCardRadioGroup answers={mockAnswers} correctAnswer={1} />);
        const radios = screen.getAllByRole("radio");
        const selectedRadio = radios.find(radio => radio.getAttribute("value") === "1");

        expect(selectedRadio).toBeChecked();
    });

    it("disables all radio options when disabled prop is true", () => {
        render(<QuestionCardRadioGroup answers={mockAnswers} disabled />);
        const radios = screen.getAllByRole("radio");

        radios.forEach(radio => expect(radio).toBeDisabled());
    });

    it("renders nothing when answers array is empty", () => {
        render(<QuestionCardRadioGroup answers={[]} />);
        expect(screen.queryAllByRole("radio")).toHaveLength(0);
    });
});

