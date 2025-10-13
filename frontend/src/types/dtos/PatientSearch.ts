import DoctorPatient from "@/types/models/DoctorPatient";
import User from "@/types/models/User";

export default interface PatientSearch {
    doctor_patients: DoctorPatient[];
    patients: User[];
}