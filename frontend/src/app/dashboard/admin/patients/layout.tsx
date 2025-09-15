import {PropsWithChildren} from "react";
import UsersTriggerProvider from "@/features/admin/user-modal/contexts/UsersTriggerProvider";
import AdminPatients from "@/features/admin/patients/AdminPatients";

export default function PatientsLayout(
    { children } : PropsWithChildren
) {
    return (
        <UsersTriggerProvider>
            <AdminPatients />
            {children}
        </UsersTriggerProvider>
    );
}