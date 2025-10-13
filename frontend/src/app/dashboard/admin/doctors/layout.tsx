import AdminDoctors from "@/features/admin/users/AdminDoctors";
import {PropsWithChildren} from "react";
import UsersTriggerProvider from "@/features/admin/user-modal/contexts/UsersTriggerProvider";

export default function DoctorsPage(
    {children}: PropsWithChildren
) {
    return (
        <UsersTriggerProvider>
            <AdminDoctors />
            {children}
        </UsersTriggerProvider>
    );
}