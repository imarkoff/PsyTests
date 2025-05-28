import React from "react";
import { render, screen } from "@testing-library/react";
import LazyComponent from "./LazyComponent";
import { useInView } from "react-intersection-observer";
import "@testing-library/jest-dom";

jest.mock("react-intersection-observer", () => ({
    useInView: jest.fn(),
}));

const mockUseInView = useInView as jest.Mock;

describe("LazyComponent", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders visibleChildren always", () => {
        mockUseInView.mockReturnValue({ ref: jest.fn(), inView: false });
        render(
            <LazyComponent height="100px" visibleChildren={<span>Always Visible</span>}>
                <span>Lazy Content</span>
            </LazyComponent>
        );
        expect(screen.getByText("Always Visible")).toBeInTheDocument();
    });

    it("renders children when in view", () => {
        mockUseInView.mockReturnValue({ ref: jest.fn(), inView: true });
        render(
            <LazyComponent height="100px">
                <span>Lazy Content</span>
            </LazyComponent>
        );
        expect(screen.getByText("Lazy Content")).toBeInTheDocument();
    });

    it("renders placeholder with correct height when not in view", () => {
        mockUseInView.mockReturnValue({ ref: jest.fn(), inView: false });
        render(
            <LazyComponent height="123px">
                <span>Lazy Content</span>
            </LazyComponent>
        );
        const placeholder = screen.getByTestId("lazy-placeholder");
        expect(placeholder).toHaveStyle({ height: "123px" });
    });

    it("does not render children when not in view", () => {
        mockUseInView.mockReturnValue({ ref: jest.fn(), inView: false });
        render(
            <LazyComponent height="100px">
                <span>Lazy Content</span>
            </LazyComponent>
        );
        expect(screen.queryByText("Lazy Content")).not.toBeInTheDocument();
    });

    it("passes IntersectionOptions to useInView", () => {
        const options = { threshold: 0.5 };
        mockUseInView.mockReturnValue({ ref: jest.fn(), inView: false });
        render(
            <LazyComponent height="100px" IntersectionOptions={options}>
                <span>Lazy Content</span>
            </LazyComponent>
        );
        expect(mockUseInView).toHaveBeenCalledWith(
            expect.objectContaining({ threshold: 0.5, triggerOnce: true })
        );
    });
});