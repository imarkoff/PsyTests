import { renderHook, act } from "@testing-library/react";
import useAddPatient from "./useAddPatient";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";
import "@testing-library/jest-dom";
import { addPatient } from "@/lib/controllers/doctorPatientController";

jest.mock("@/lib/controllers/doctorPatientController", () => ({
    addPatient: jest.fn(),
}));
jest.mock("@/lib/fetchers/withSafeErrorHandling", () => jest.fn(fn => fn));

const mockAddPatient = addPatient as jest.Mock;
const mockWithSafeErrorHandling = withSafeErrorHandling as jest.Mock;

beforeEach(() => {
    jest.clearAllMocks();
});

it("sets loading to true while adding patient and success to true after success", async () => {
    let resolveAddPatient: () => void;
    mockAddPatient.mockImplementation(
        () => new Promise<void>(resolve => { resolveAddPatient = resolve; })
    );

    const { result } = renderHook(() => useAddPatient("patient-1"));

    act(() => {
        result.current.handlePutOnRecord();
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
        resolveAddPatient();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(true);
    expect(mockAddPatient).toHaveBeenCalledWith("patient-1");
});

it("does not call addPatient if already loading", async () => {
    mockAddPatient.mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useAddPatient("patient-2"));

    act(() => {
        result.current.handlePutOnRecord();
    });

    await act(async () => {
        result.current.handlePutOnRecord().then();
    });

    expect(mockAddPatient).toHaveBeenCalledTimes(1);
});

it("does not call addPatient if already successful", async () => {
    mockAddPatient.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAddPatient("patient-3"));

    await act(async () => {
        await result.current.handlePutOnRecord();
    });

    await act(async () => {
        await result.current.handlePutOnRecord();
    });

    expect(mockAddPatient).toHaveBeenCalledTimes(1);
});

it("sets loading to false if withSafeErrorHandling throws", async () => {
    mockWithSafeErrorHandling.mockImplementation(() => { throw new Error("fail") });
    const { result } = renderHook(() => useAddPatient("patient-4"));

    await act(async () => {
        try { await result.current.handlePutOnRecord(); }
        catch { }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(false);
});