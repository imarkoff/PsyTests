import { render, screen } from "@testing-library/react";
import QuestionCardImage from "@/components/QuestionCard/layout/QuestionCardImage";
import "@testing-library/jest-dom";

describe("QuestionCardImage", () => {
    it("renders image with given src and alt", () => {
        render(<QuestionCardImage src="/img.png" alt="Sample image" />);
        const img = screen.getByAltText("Sample image");

        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", expect.stringContaining("img.png"));
    });

    it("applies default width and height when not provided", () => {
        render(<QuestionCardImage src="/img.png" alt="Default size" />);
        const img = screen.getByAltText("Default size");

        expect(img).toHaveAttribute("width", "600");
        expect(img).toHaveAttribute("height", "250");
    });

    it("applies custom width and height when provided", () => {
        render(<QuestionCardImage src="/img.png" alt="Custom size" width={300} height={100} />);
        const img = screen.getByAltText("Custom size");

        expect(img).toHaveAttribute("width", "300");
        expect(img).toHaveAttribute("height", "100");
    });

    it("renders image with pointerEvents style set to none", () => {
        render(<QuestionCardImage src="/img.png" alt="Pointer events" />);

        const img = screen.getByAltText("Pointer events");
        expect(img).toHaveStyle({ pointerEvents: "none" });
    });

    it("renders image with width 100% and height auto styles", () => {
        render(<QuestionCardImage src="/img.png" alt="Responsive image" />);

        const img = screen.getByAltText("Responsive image");
        expect(img).toHaveStyle({ width: "100%", height: "auto" });
    });
});