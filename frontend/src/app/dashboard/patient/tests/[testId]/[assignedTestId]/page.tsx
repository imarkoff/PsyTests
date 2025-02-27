"use client";

import TestProvider from "@/app/dashboard/patient/tests/[testId]/[assignedTestId]/context/TestProvider";
import PageContent from "@/app/dashboard/patient/tests/[testId]/[assignedTestId]/PageContent";
import {useParams} from "next/navigation";

export default function Page() {
    const { testId, assignedTestId } = useParams<{ testId: string; assignedTestId: string }>();

    return (
        <TestProvider testId={testId} assignedTestId={assignedTestId}>
            <PageContent />
        </TestProvider>
    );
}