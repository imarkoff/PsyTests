import {renderHook, act} from "@testing-library/react";
import useFindPatient from "@/components/FindPatientDialog/hooks/useFindPatient";
import { findPatient } from "@/lib/controllers/doctorPatientController";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";
import "@testing-library/jest-dom";

jest.mock("@/lib/controllers/doctorPatientController");
jest.mock("@/lib/fetchers/withSafeErrorHandling");


jest.mock(
    "@/hooks/useDebounce",
    () => <T>(value: T) => value
);

const mockFindPatient = findPatient as jest.Mock;
const mockWithSafeErrorHandling = withSafeErrorHandling as jest.Mock;

beforeEach(() => {
    jest.clearAllMocks();
    mockWithSafeErrorHandling.mockImplementation(<T>(fn: T) => fn);
});

it("returns loading state and results after successful search", async () => {
    const mockResults = {
        doctor_patients: [{id: 1, name: "John"}],
        patients: [{id: 2, name: "Jane"}]
    };
    mockFindPatient.mockResolvedValueOnce(mockResults);

    const {result} = renderHook(() => useFindPatient());
    await act(async () => { result.current.setQuery("John"); });

    const { loading, results: { doctorPatients, otherPatients, isResultsEmpty } } = result.current;
    expect(loading).toBe(false);
    expect(doctorPatients).toEqual(mockResults.doctor_patients);
    expect(otherPatients).toEqual(mockResults.patients);
    expect(isResultsEmpty).toBe(false);
});

it("sets isResultsEmpty to true when no results are found", async () => {
    const mockResults = {
        doctor_patients: [],
        patients: []
    };
    mockFindPatient.mockResolvedValueOnce(mockResults);

    const {result} = renderHook(() => useFindPatient());
    await act(async () => { result.current.setQuery("Unknown"); });

    const { doctorPatients, otherPatients, isResultsEmpty } = result.current.results;
    expect(isResultsEmpty).toBe(true);
    expect(doctorPatients).toEqual([]);
    expect(otherPatients).toEqual([]);
});

it("does not call search when query is empty", async () => {
    const {result} = renderHook(() => useFindPatient());
    await act(async () => { result.current.setQuery(""); });

    expect(mockFindPatient).not.toHaveBeenCalled();
});

it("clears results when clearResults is called", async () => {
    const mockResults = {
        doctor_patients: [{id: 1, name: "John"}],
        patients: []
    };
    mockFindPatient.mockResolvedValueOnce(mockResults);

    const {result} = renderHook(() => useFindPatient());
    await act(async () => { result.current.setQuery("John"); });
    await act(async () => { result.current.clearResults(); });
    const { doctorPatients, otherPatients, isResultsEmpty } = result.current.results;

    expect(doctorPatients).toBeUndefined();
    expect(otherPatients).toBeUndefined();
    expect(isResultsEmpty).toBe(true);
});

it("sets loading to false if search throws an error", async () => {
    mockFindPatient.mockRejectedValueOnce(new Error("Network error"));

    const {result} = renderHook(() => useFindPatient());
    await act(async () => { result.current.setQuery("Error"); });
    const {
        loading, error,
        results: { doctorPatients, otherPatients }
    } = result.current;

    expect(loading).toBe(false);
    expect(error).toBe("Network error");
    expect(doctorPatients).toBeUndefined();
    expect(otherPatients).toBeUndefined();
});