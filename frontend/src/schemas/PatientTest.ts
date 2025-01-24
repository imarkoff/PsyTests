import Test from "@/schemas/Test";

export default interface PatientTest {
    id: string;
    patient_id: string;
    assigned_by_id: string;
    test: Test;
    assigned_at: string; // ISO date
}