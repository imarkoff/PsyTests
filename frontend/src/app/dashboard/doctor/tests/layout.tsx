import {ReactNode} from "react";
import {getAllTests} from "@/lib/controllers/testController";
import ChooseTestPlaceholder from "@/features/dashboard/doctor/tests/components/ChooseTestPlaceholder";

export default async function Layout({children}: { children: ReactNode }) {
    const allTestsResponse = await getAllTests();

    return (
        <ChooseTestPlaceholder testsResponse={allTestsResponse}>
            {children}
        </ChooseTestPlaceholder>
    );
}