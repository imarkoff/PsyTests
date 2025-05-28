import { render, screen } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import QuestionCardContextProvider from "@/components/QuestionCard/context/QuestionCardContextProvider";
import QuestionCardContext from "@/components/QuestionCard/context/QuestionCardContext";
import React from "react";

function Wrapper({ children }: { children: React.ReactNode }) {
    const methods = useForm();
    return <FormProvider {...methods}>{children}</FormProvider>;
}

function Consumer() {
    return (
        <QuestionCardContext.Consumer>
            {value => (
                <>
                    <span data-testid="index">{value?.index}</span>
                    <span data-testid="moduleName">{value?.moduleName}</span>
                    <span data-testid="chosenAnswer">{value?.chosenAnswer ?? ""}</span>
                </>
            )}
        </QuestionCardContext.Consumer>
    );
}

describe("QuestionCardContextProvider", () => {
    it("provides context values to children with moduleName", () => {
        render(
            <Wrapper>
                <QuestionCardContextProvider index={1} moduleName="math">
                    <Consumer />
                </QuestionCardContextProvider>
            </Wrapper>
        );
        expect(screen.getByTestId("index").textContent).toBe("1");
        expect(screen.getByTestId("moduleName").textContent).toBe("math");
    });

    it("provides context values to children without moduleName", () => {
        render(
            <Wrapper>
                <QuestionCardContextProvider index={2}>
                    <Consumer />
                </QuestionCardContextProvider>
            </Wrapper>
        );
        expect(screen.getByTestId("index").textContent).toBe("2");
        expect(screen.getByTestId("moduleName").textContent).toBe("");
    });

    it("handles missing form context gracefully", () => {
        render(
            <QuestionCardContextProvider index={3}>
                <Consumer />
            </QuestionCardContextProvider>
        );
        expect(screen.getByTestId("index").textContent).toBe("3");
    });

    it("register function is callable and returns undefined if not available", () => {
        let registerFn: (() => void) | undefined;
        render(
            <QuestionCardContextProvider index={4}>
                <QuestionCardContext.Consumer>
                    {value => {
                        registerFn = value?.register;
                        return null;
                    }}
                </QuestionCardContext.Consumer>
            </QuestionCardContextProvider>
        );
        expect(typeof registerFn).toBe("function");
        expect(registerFn?.()).toBeUndefined();
    });
});