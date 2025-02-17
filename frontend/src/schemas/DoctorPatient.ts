import User from "@/schemas/User";

export default interface DoctorPatient {
    id: string; // uuid
    patient: User;
    assigned_at: string; // date-time
    is_active: boolean;
    needs_attention: boolean;
}