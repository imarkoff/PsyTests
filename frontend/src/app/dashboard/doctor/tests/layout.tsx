import {ReactNode} from "react";
import {getAllTests} from "@/lib/controllers/testController";
import DoctorTests from "@/features/dashboard/doctor/tests/DoctorTests";

export default async function Layout({children}: { children: ReactNode }) {
    const allTestsResponse = await getAllTests();

    return (
        <DoctorTests testsResponse={allTestsResponse}>
            {children}
        </DoctorTests>
    );
}