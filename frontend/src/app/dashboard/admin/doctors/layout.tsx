import AdminDoctors from "@/features/admin/doctors/AdminDoctors";
import {PropsWithChildren} from "react";

export default function DoctorsPage(
    {children}: PropsWithChildren
) {
    return (
        <>
            <AdminDoctors />
            {children}
        </>
    );
}