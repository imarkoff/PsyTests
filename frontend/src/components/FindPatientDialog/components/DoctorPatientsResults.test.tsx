import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DoctorPatientsResults from "./DoctorPatientsResults";
import DoctorPatient from "@/types/models/DoctorPatient";
import {Roles} from "@/types/enums/Role";
import User from "@/types/models/User";

const mockedDoctorPatient: DoctorPatient = {
    id: "10e380ba-aee4-49e6-a6e2-a8511ad36ae5",
    patient: {
        id: "10e380ba-aee4-49e6-a6e2-a8511ad36ae5",
        name: "John",
        surname: "Doe",
        birth_date: "1990-01-01",
        gender: "male",
        phone: "380999999999",
        role: Roles.patient
    } as User,
    assigned_at: "2023-10-01T12:00:00Z",
    unassigned_at: null,
    needs_attention: false,
};

jest.mock("@/components/PatientCard/DoctorPatientCard", () => {
    return function MockDoctorPatientCard({ patient }: { patient: DoctorPatient }) {
        return <div data-testid={`patient-card-${patient.id}`}>{patient.patient.name}</div>;
    };
});

describe("DoctorPatientsResults", () => {
    it("displays active patients with correct heading", () => {
        const patients: DoctorPatient[] = [
            { ...mockedDoctorPatient, id: "1" },
            { ...mockedDoctorPatient, id: "2", patient: { ...mockedDoctorPatient.patient, name: "Jane Smith" } },
        ];

        render(<DoctorPatientsResults patients={patients} />);

        expect(screen.getByText("Пацієнти на вашому обліку")).toBeInTheDocument();
        expect(screen.getByTestId("patient-card-1")).toBeInTheDocument();
        expect(screen.getByTestId("patient-card-2")).toBeInTheDocument();
        expect(screen.queryByText("Виписані пацієнти")).not.toBeInTheDocument();
    });

    it("displays inactive patients with correct heading", () => {
        const patients: DoctorPatient[] = [
            { ...mockedDoctorPatient, id: "1", unassigned_at: "2023-10-01T12:00:00Z" },
            { ...mockedDoctorPatient, id: "2", unassigned_at: "2023-10-02T12:00:00Z", },
        ];

        render(<DoctorPatientsResults patients={patients} />);

        expect(screen.getByText("Виписані пацієнти")).toBeInTheDocument();
        expect(screen.getByTestId("patient-card-1")).toBeInTheDocument();
        expect(screen.getByTestId("patient-card-2")).toBeInTheDocument();
        expect(screen.queryByText("Пацієнти на вашому обліку")).not.toBeInTheDocument();
    });

    it("displays both active and inactive patients with separate headings", () => {
        const patients: DoctorPatient[] = [
            { ...mockedDoctorPatient, id: "1", unassigned_at: null },
            { ...mockedDoctorPatient, id: "2", unassigned_at: "2023-10-01T12:00:00Z" },
        ];

        render(<DoctorPatientsResults patients={patients} />);

        expect(screen.getByText("Пацієнти на вашому обліку")).toBeInTheDocument();
        expect(screen.getByText("Виписані пацієнти")).toBeInTheDocument();
        expect(screen.getByTestId("patient-card-1")).toBeInTheDocument();
        expect(screen.getByTestId("patient-card-2")).toBeInTheDocument();
    });

    it("renders nothing when patients array is empty", () => {
        const { container } = render(<DoctorPatientsResults patients={[]} />);

        expect(screen.queryByText("Пацієнти на вашому обліку")).not.toBeInTheDocument();
        expect(screen.queryByText("Виписані пацієнти")).not.toBeInTheDocument();
        expect(container.innerHTML).toBe("");
    });
});