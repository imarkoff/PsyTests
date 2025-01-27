import User from "@/schemas/User";
import PatientTest from "@/schemas/PatientTest";

export default interface PatientInfo {
    patient: User;
    tests: PatientTest[];
}