import {renderHook, act} from "@testing-library/react";
import useFindPatientModal from "@/components/FindPatientDialog/hooks/useFindPatientModal";
import useFindPatient from "@/components/FindPatientDialog/hooks/useFindPatient";
import "@testing-library/jest-dom";

jest.mock("@/components/FindPatientDialog/hooks/useFindPatient");

const mockUseFindPatient = useFindPatient as jest.Mock;
const mockSetQuery = jest.fn();
const mockClearResults = jest.fn();

const mockUseFindPatientReturn = {
    loading: false,
    error: null,
    results: { doctorPatients: [], otherPatients: [], isResultsEmpty: true },
    clearResults: mockClearResults,
    setQuery: mockSetQuery
}

beforeEach(() => {
    jest.clearAllMocks();
    mockUseFindPatient.mockReturnValue(mockUseFindPatientReturn);
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
});

it("calls onClose, setQuery, and clearResults when handleClose is called", () => {
    const onClose = jest.fn();
    const { result } = renderHook(() => useFindPatientModal(true, onClose));

    act(() => {
        result.current.handleClose();
    });

    expect(onClose).toHaveBeenCalled();
    expect(mockSetQuery).toHaveBeenCalledWith("");
    expect(mockClearResults).toHaveBeenCalled();
});

it("exposes values from useFindPatient in the returned object", () => {
    const mockResults = {
        doctorPatients: [{ id: 1, name: "Test" }],
        otherPatients: [],
        isResultsEmpty: false
    };
    mockUseFindPatient.mockReturnValue({
        ...mockUseFindPatientReturn,
        loading: true,
        error: "Test error",
        results: mockResults
    });
    const onClose = jest.fn();

    const { result } = renderHook(() => useFindPatientModal(true, onClose));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe("Test error");
    expect(result.current.results).toEqual(mockResults);
    expect(result.current.setQuery).toBe(mockSetQuery);
});

it("initializes searchRef in the returned object", () => {
    const onClose = jest.fn();

    const { result } = renderHook(() => useFindPatientModal(true, onClose));

    expect(result.current.searchRef).toBeDefined();
});

it("sets up a timeout to focus search input when modal opens", () => {
    const onClose = jest.fn();
    jest.spyOn(global, 'setTimeout');

    renderHook(() => useFindPatientModal(true, onClose));

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 50);
});

it("does not set up a timeout when modal is closed", () => {
    const onClose = jest.fn();
    jest.spyOn(global, 'setTimeout');

    renderHook(() => useFindPatientModal(false, onClose));

    expect(setTimeout).not.toHaveBeenCalled();
});

it("clears the timeout when unmounting", () => {
    const onClose = jest.fn();
    jest.spyOn(global, 'clearTimeout');

    const { unmount } = renderHook(() => useFindPatientModal(true, onClose));
    act(() => {
        jest.advanceTimersByTime(25); // Advance halfway through the timeout
    });
    unmount();

    expect(clearTimeout).toHaveBeenCalled();
});