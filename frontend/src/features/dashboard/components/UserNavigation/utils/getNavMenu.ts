import {Role, Roles} from "@/types/enums/Role";
import doctorNavigation from "@/features/dashboard/doctor/doctorNavigation";
import adminNavigation from "@/features/admin/adminNavigation";

export default function getNavMenu(role?: Role) {
    switch (role) {
        case Roles.doctor:
            return doctorNavigation;
        // case Roles.patient:
        //     return patientNav;
        case Roles.admin:
            return adminNavigation
        default:
            return [];
    }
};