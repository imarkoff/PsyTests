import TestsLayout from "@/app/dashboard/patient/layout/TestsLayout";
import TestsHistoryLayout from "@/app/dashboard/patient/layout/TestsHistoryLayout";
import {getAssignedTests, getTestsHistory} from "@/lib/controllers/patientTestController";

export default async function ClientPage() {
    return (
        <>
            <TestsLayout tests={(await getAssignedTests()).data ?? []} />
            <TestsHistoryLayout testsHistory={(await getTestsHistory()).data} />
        </>
    );
}