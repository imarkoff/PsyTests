import User from "@/schemas/User";
import Test from "@/schemas/Test";

export default interface PatientInfo {
    patient: User;
    tests: Test[];
}