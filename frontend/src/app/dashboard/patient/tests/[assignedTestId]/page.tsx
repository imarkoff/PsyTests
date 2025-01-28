"use client";

import TestProvider from "@/app/dashboard/patient/tests/[assignedTestId]/context/TestProvider";
import PageContent from "@/app/dashboard/patient/tests/[assignedTestId]/PageContent";
import {useParams} from "next/navigation";

export default function Page() {
    const { assignedTestId } = useParams<{ assignedTestId: string }>();

    return (
        <TestProvider assignedTestId={assignedTestId}>
            <PageContent />
        </TestProvider>
    );
}