import User from "@/types/models/User";

export default interface DoctorPatient {
    id: string; // uuid
    patient: User;
    assigned_at: string; // date-time
    unassigned_at: string | null; // date-time or null
    needs_attention: boolean;
}