import TestBase from "@/schemas/TestBase";

export default interface PatientTest {
    id: string;
    patient_id: string;
    assigned_by_id: string;
    test: TestBase;
    assigned_at: string; // ISO date
}