import { render } from "@testing-library/react";
import TestHistoryCardSkeleton from "./TestHistoryCardSkeleton";
import "@testing-library/jest-dom";

describe("TestHistoryCardSkeleton", () => {
    it("renders all skeleton elements when loading", () => {
        const { container } = render(<TestHistoryCardSkeleton isLoading={true} />);
        expect(container.querySelectorAll('.MuiSkeleton-root')).toHaveLength(5);
    });

    it("applies full opacity when loading", () => {
        const { container } = render(<TestHistoryCardSkeleton isLoading={true} />);
        expect(container.firstChild).toHaveStyle("opacity: 1");
    });

    it("applies reduced opacity when not loading", () => {
        const { container } = render(<TestHistoryCardSkeleton isLoading={false} />);
        expect(container.firstChild).toHaveStyle("opacity: 0.5");
    });

    it("disables skeleton animation when not loading", () => {
        const { container } = render(<TestHistoryCardSkeleton isLoading={false} />);
        container.querySelectorAll('.MuiSkeleton-root').forEach(skeleton => {
            expect(skeleton).not.toHaveClass("MuiSkeleton-wave");
        });
    });
});