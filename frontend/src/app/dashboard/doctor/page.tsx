import {redirect} from "next/navigation";

export default function DoctorPage() {
    redirect("/dashboard/doctor/patients");
}