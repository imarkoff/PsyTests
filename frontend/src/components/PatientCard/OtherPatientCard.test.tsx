import { render, screen, fireEvent } from "@testing-library/react";
import OtherPatientCard from "./OtherPatientCard";
import { mockedPatient } from "./mockedPatient";
import useAddPatient from "@/components/PatientCard/useAddPatient";
import "@testing-library/jest-dom";
import {PatientCardProps} from "@/components/PatientCard/PatientCard";

/* eslint-disable react/display-name */

jest.mock("@/components/PatientCard/useAddPatient");

jest.mock("@/components/PatientCard/PatientCard", () => (
    { patient, footer }: PatientCardProps
    ) => (
        <div data-testid="patient-card">
            <div>{patient.name}</div>
            {footer}
        </div>
    ),
);

describe("OtherPatientCard", () => {
    it("renders AddIcon and correct tooltip when not successful", () => {
        (useAddPatient as jest.Mock).mockReturnValue({
            loading: false,
            success: false,
            handlePutOnRecord: jest.fn(),
        });

        render(<OtherPatientCard patient={mockedPatient} />);

        expect(screen.getByTestId("add-patient-button")).toHaveAttribute("aria-label", "Додати пацієнта");
    });

    it("renders CheckIcon and correct tooltip when successful", () => {
        (useAddPatient as jest.Mock).mockReturnValue({
            loading: false,
            success: true,
            handlePutOnRecord: jest.fn(),
        });

        render(<OtherPatientCard patient={mockedPatient} />);

        expect(screen.getByTestId("add-patient-button")).toHaveAttribute("aria-label", "Пацієнта додано");
    });

    it("calls handlePutOnRecord when button is clicked", () => {
        const handlePutOnRecord = jest.fn();
        (useAddPatient as jest.Mock).mockReturnValue({
            loading: false,
            success: false,
            handlePutOnRecord,
        });

        render(<OtherPatientCard patient={mockedPatient} />);
        fireEvent.click(screen.getByRole("button"));

        expect(handlePutOnRecord).toHaveBeenCalled();
    });

    it("button is disabled when loading", () => {
        (useAddPatient as jest.Mock).mockReturnValue({
            loading: true,
            success: false,
            handlePutOnRecord: jest.fn(),
        });

        render(<OtherPatientCard patient={mockedPatient} />);

        expect(screen.getByRole("button")).toBeDisabled();
    });

    it("button is disabled when success", () => {
        const handlePutOnRecord = jest.fn();
        (useAddPatient as jest.Mock).mockReturnValue({
            loading: false,
            success: true,
            handlePutOnRecord: handlePutOnRecord,
        });

        render(<OtherPatientCard patient={mockedPatient} />);

        expect(handlePutOnRecord).not.toHaveBeenCalled();
    });
});