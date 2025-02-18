import DoctorPatient from "@/schemas/DoctorPatient";
import User from "@/schemas/User";

export default interface PatientSearch {
    doctor_patients: DoctorPatient[];
    patients: User[];
}