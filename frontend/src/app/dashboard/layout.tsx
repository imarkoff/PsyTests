import {ReactNode} from "react";
import { getMe } from "@/lib/controllers/userController";
import DashboardLayout from "@/features/dashboard/components/DashboardLayout";

export default async function Layout({children}: { children: ReactNode }) {
    const userResponse = await getMe();

    return (
        <DashboardLayout userResponse={userResponse}>
            {children}
        </DashboardLayout>
    );
}