import {Role, Roles} from "@/schemas/Role";
import doctorNavigation from "@/features/dashboard/doctor/doctorNavigation";

export default function getNavMenu(role?: Role) {
    switch (role) {
        case Roles.doctor:
            return doctorNavigation;
        // case Roles.patient:
        //     return patientNav;
        default:
            return [];
    }
};