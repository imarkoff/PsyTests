import {ReactNode} from "react";
import {getAllTests} from "@/lib/controllers/testController";
import AdminTests from "@/features/admin/tests/AdminTests";

export default async function Layout({children}: { children: ReactNode }) {
    const allTestsResponse = await getAllTests();

    return (
        <AdminTests testsResponse={allTestsResponse}>
            {children}
        </AdminTests>
    );
}