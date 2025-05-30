import { render } from "@testing-library/react";
import QuestionCardSkeleton from "./QuestionCardSkeleton";
import "@testing-library/jest-dom";

describe("QuestionCardSkeleton", () => {
    it("renders all skeleton elements when loading", () => {
        const { container } = render(<QuestionCardSkeleton isLoading />);
        const skeletons = container.querySelectorAll('.MuiSkeleton-root');

        expect(skeletons).toHaveLength(8);
    });

    it("renders skeletons without animation when isLoading is false", () => {
        const { container } = render(<QuestionCardSkeleton isLoading={false} />);
        const skeletons = container.querySelectorAll('.MuiSkeleton-root');

        skeletons.forEach(skeleton => {
            expect(skeleton).not.toHaveClass("MuiSkeleton-wave");
        });
    });

    it("renders skeletons with default animation when isLoading is undefined", () => {
        const { container } = render(<QuestionCardSkeleton />);
        const skeletons = container.querySelectorAll('.MuiSkeleton-root');

        skeletons.forEach(skeleton => {
            expect(skeleton).toHaveClass("MuiSkeleton-wave");
        });
    });
});