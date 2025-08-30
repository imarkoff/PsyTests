import { render, screen } from "@testing-library/react";
import DoctorPatientCard from "@/components/PatientCard/DoctorPatientCard";
import { useRouter } from "next/navigation";
import DoctorPatient from "@/types/models/DoctorPatient";
import {PatientCardProps} from "@/components/PatientCard/PatientCard";
import "@testing-library/jest-dom";
import {mockedPatient} from "@/components/PatientCard/mockedPatient";

/* eslint-disable react/display-name */

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("@/components/PatientCard/PatientCard", () => (
    { patient, needsAttention, onClick }: PatientCardProps
    ) => (
        <div data-testid="patient-card" onClick={() => onClick?.(patient)}>
            {patient.name} {patient.surname ?? ""} - {needsAttention ? "Attention Needed" : "No Attention"}
        </div>
    ),
);

const mockPush = jest.fn();

const mockDoctorPatient: DoctorPatient = {
    id: "d7461346-7e6c-40e4-994e-16f85385f470",
    patient: mockedPatient,
    assigned_at: "2023-10-01T12:00:00Z",
    is_active: true,
    needs_attention: true,
}

beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    mockPush.mockClear();
});

describe("DoctorPatientCard", () => {
    it("renders PatientCard with correct patient and needsAttention props", () => {
        render(<DoctorPatientCard patient={mockDoctorPatient} />);

        expect(screen.getByTestId("patient-card")).toHaveTextContent("John Doe - Attention Needed");
    });

    it("calls router.push with correct path when PatientCard is clicked", () => {
        render(<DoctorPatientCard patient={mockDoctorPatient} />);
        screen.getByTestId("patient-card").click();

        expect(mockPush).toHaveBeenCalledWith("/dashboard/doctor/patients/4afc891b-7181-4cff-840a-8cd176537985");
    });

    it("handles missing needs_attention as false", () => {
        const patient = {
            ...mockDoctorPatient,
            needs_attention: false,
        };

        render(<DoctorPatientCard patient={patient} />);

        expect(screen.getByTestId("patient-card")).toHaveTextContent("John Doe - No Attention");
    });
});