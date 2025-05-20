import {Role, Roles} from "@/schemas/Role";
import doctorNav from "@/app/dashboard/doctor/doctorNav";

export default function getNavMenu(role?: Role) {
    switch (role) {
        case Roles.doctor:
            return doctorNav;
        // case Roles.patient:
        //     return patientNav;
        default:
            return [];
    }
};