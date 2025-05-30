import { renderHook, act } from "@testing-library/react";
import useValueChanger from "./useValueChanger";

describe("useValueChanger", () => {
    it("returns undefined as initial chosenAnswer", () => {
        const setValue = jest.fn();

        const { result } = renderHook(() => useValueChanger("answer", setValue));

        expect(result.current.chosenAnswer).toBeUndefined();
    });

    it("updates chosenAnswer and calls setValue with string", () => {
        const setValue = jest.fn();

        const { result } = renderHook(() => useValueChanger("answer", setValue));
        act(() => {
            result.current.handleAnswerChange("42");
        });

        expect(result.current.chosenAnswer).toBe("42");
        expect(setValue).toHaveBeenCalledWith("answer", "42");
    });

    it("updates chosenAnswer and calls setValue with number", () => {
        const setValue = jest.fn();

        const { result } = renderHook(() => useValueChanger("answer", setValue));
        act(() => {
            result.current.handleAnswerChange(7);
        });

        expect(result.current.chosenAnswer).toBe(7);
        expect(setValue).toHaveBeenCalledWith("answer", 7);
    });

    it("handles multiple answer changes and always updates chosenAnswer", () => {
        const setValue = jest.fn();

        const { result } = renderHook(() => useValueChanger("answer", setValue));
        act(() => {
            result.current.handleAnswerChange("first");
            result.current.handleAnswerChange("second");
        });

        expect(result.current.chosenAnswer).toBe("second");
        expect(setValue).toHaveBeenCalledWith("answer", "first");
        expect(setValue).toHaveBeenCalledWith("answer", "second");
    });

    it("handles empty string as answer", () => {
        const setValue = jest.fn();

        const { result } = renderHook(() => useValueChanger("answer", setValue));
        act(() => {
            result.current.handleAnswerChange("");
        });

        expect(result.current.chosenAnswer).toBe("");
        expect(setValue).toHaveBeenCalledWith("answer", "");
    });
})

