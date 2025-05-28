import QuestionCardContext, {useQuestionCardContext} from "./QuestionCardContext";
import { renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import {mockedContext} from "@/components/QuestionCard/context/mockedContext";

const wrapper = ({ children }: { children: ReactNode }) => (
    <QuestionCardContext.Provider value={mockedContext}>{children}</QuestionCardContext.Provider>
);

describe("QuestionCardContext", () => {
    it("returns default context values when no provider is used", () => {
        const { result } = renderHook(() => useQuestionCardContext());

        expect(result.current.error).toBeUndefined();
        expect(result.current.index).toBe(0);
        expect(result.current.chosenAnswer).toBeUndefined();
        expect(typeof result.current.handleAnswerChange).toBe("function");
    });

    it("returns provided context values from provider", () => {
        const { result } = renderHook(() => useQuestionCardContext(), { wrapper });

        expect(result.current.error).toBeUndefined();
        expect(result.current.index).toBe(0);
        expect(result.current.moduleName).toBe("science");
        expect(result.current.chosenAnswer).toBeUndefined();
        expect(result.current.handleAnswerChange).toBe(mockedContext.handleAnswerChange);
    });

    it("returns undefined for register if not provided in context", () => {
        const wrapperNoRegister = ({ children }: { children: ReactNode }) => (
            <QuestionCardContext.Provider value={{
                ...mockedContext,
                register: undefined,
            }}>{children}</QuestionCardContext.Provider>
        );

        const { result } = renderHook(() => useQuestionCardContext(), { wrapper: wrapperNoRegister });

        expect(result.current.register).toBeUndefined();
    });
});