import { renderHook } from "@testing-library/react";
import useTestMarks from "./useTestMarks";
import useSWR from "swr"
import "@testing-library/jest-dom";

jest.mock("swr");
jest.mock("@/lib/fetchers/withSafeErrorHandling", () => jest.fn(fn => fn));
jest.mock("@/lib/controllers/testController");

const mockUseSWR = useSWR as jest.Mock;

it("returns marks data when fetch is successful", () => {
    const mockMarks = [{ id: 1, value: 5 }];
    mockUseSWR.mockReturnValue({
        data: mockMarks,
        isLoading: false,
        error: undefined,
    });

    const { result } = renderHook(() => useTestMarks("test-id"));

    expect(result.current.marks).toEqual(mockMarks);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeUndefined();
});

it("returns loading state when data is being fetched", () => {
    mockUseSWR.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: undefined,
    });

    const { result } = renderHook(() => useTestMarks("test-id"));

    expect(result.current.marks).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeUndefined();
});

it("returns error when fetch fails", () => {
    const mockError = new Error("Failed to fetch");
    mockUseSWR.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
    });

    const { result } = renderHook(() => useTestMarks("test-id"));

    expect(result.current.marks).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(mockError);
});

it("passes withSafeErrorHandling(getTestMarks) as fetcher to useSWR", () => {
    mockUseSWR.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: undefined,
    });

    renderHook(() => useTestMarks("test-id"));

    expect(mockUseSWR).toHaveBeenCalledWith(
        ["tests", "test-id", "marks"],
        expect.any(Function),
        { revalidateOnFocus: false }
    );
});