import { render } from "@testing-library/react";
import PatientCardSkeleton from "./PatientCardSkeleton";
import "@testing-library/jest-dom";

it("renders skeletons with wave animation by default", () => {
    const { container } = render(<PatientCardSkeleton />);
    const skeletons = container.querySelectorAll(".MuiSkeleton-wave");

    expect(skeletons.length).toBeGreaterThan(0);
});

it("renders skeletons with wave animation when isLoading is true", () => {
    const { container } = render(<PatientCardSkeleton isLoading={true} />);
    const skeletons = container.querySelectorAll(".MuiSkeleton");

    skeletons.forEach(skeleton => {
        expect(skeleton).toHaveClass("MuiSkeleton-wave");
    });
});

it("renders skeletons without animation when isLoading is false", () => {
    const {container} = render(<PatientCardSkeleton isLoading={false} />);

    const skeletons = container.querySelectorAll(".MuiSkeleton");

    skeletons.forEach(skeleton => {
        expect(skeleton).not.toHaveClass("MuiSkeleton-wave");
    });
});