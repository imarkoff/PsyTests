import { render, screen } from "@testing-library/react";
import QuestionCardBase from "./QuestionCardBase";
import * as QuestionCardContext from "@/components/QuestionCard/context/QuestionCardContext";
import "@testing-library/jest-dom";
import {ReactNode} from "react";
import {mockedContext} from "@/components/QuestionCard/context/mockedContext";

/* eslint-disable react/display-name */

jest.mock("@/components/QuestionCard/context/QuestionCardContext");
jest.mock(
    "@/components/LazyComponent",
    () => (
        {children, visibleChildren}: { children: ReactNode, visibleChildren?: ReactNode }
    ) => (
        <div role="region" data-testid="lazy-component">
            {visibleChildren}
            {children}
        </div>
    )
);

beforeEach(() => {
    jest.spyOn(QuestionCardContext, "useQuestionCardContext").mockReturnValue(mockedContext);
})

describe("QuestionCardBase", () => {
    it("renders header, children, and footer when all props are provided", () => {
        /* eslint-disable @next/next/no-img-element */
        render(
            <QuestionCardBase
                header={<div data-testid="header">Header</div>}
                index={0}
                moduleName="science"
                image={<img data-testid="image" alt="img" />}
                footer={<div data-testid="footer">Footer</div>}
            >
                <div data-testid="children">Content</div>
            </QuestionCardBase>
        );

        expect(screen.getByTestId("header")).toBeInTheDocument();
        expect(screen.getByTestId("image")).toBeInTheDocument();
        expect(screen.getByTestId("children")).toBeInTheDocument();
        expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("renders without image and footer if not provided", () => {
        render(
            <QuestionCardBase
                header={<div data-testid="header">Header</div>}
                index={1}
            >
                <div data-testid="children">Content</div>
            </QuestionCardBase>
        );

        expect(screen.getByTestId("header")).toBeInTheDocument();
        expect(screen.getByTestId("children")).toBeInTheDocument();
        expect(screen.queryByTestId("image")).toBeNull();
        expect(screen.queryByTestId("footer")).toBeNull();
    });

    it("applies error border styles when error is present in context", () => {
        jest.spyOn(QuestionCardContext, "useQuestionCardContext").mockReturnValue({
            ...mockedContext,
            error: "some error" as never,
        });

        render(
            <QuestionCardBase
                header={<div>Header</div>}
                index={2}
            >
                <div>Content</div>
            </QuestionCardBase>
        );

        const card = screen.getByRole("region");
        expect(card).toHaveStyle("border-color: error.main");
    });

    it("renders hidden input when register is provided by context", () => {
        render(
            <QuestionCardBase
                header={<div>Header</div>}
                index={3}
            >
                <div>Content</div>
            </QuestionCardBase>
        );

        expect(screen.getByTestId("hidden-input")).toHaveProperty("name", "test");
    });

    it("doesn't render input when register is undefined", () => {
        jest.spyOn(QuestionCardContext, "useQuestionCardContext").mockReturnValue({
            ...mockedContext,
            register: undefined
        });

        render(
            <QuestionCardBase
                header={<div>Header</div>}
                index={4}
            >
                <div>Content</div>
            </QuestionCardBase>
        );

        expect(screen.getByTestId("hidden-input")).not.toHaveProperty("name", "test");
    });
})

