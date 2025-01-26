"use client";

import TestProvider, {AssignedTestIdParams} from "@/app/dashboard/patient/tests/[assignedTestId]/context/TestProvider";
import PageContent from "@/app/dashboard/patient/tests/[assignedTestId]/PageContent";

export default function Page({ params }: { params: AssignedTestIdParams }) {
    return (
        <TestProvider params={params}>
            <PageContent />
        </TestProvider>
    );
}