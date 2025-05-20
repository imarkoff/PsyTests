import {getAssignedTests, getTestsHistory} from "@/lib/controllers/patientTestController";
import PatientPage from "@/features/dashboard/patient/PatientPage";

export default async function ClientPage() {
    const assignedTestsResult = await getAssignedTests();
    const testsHistoryResult = await getTestsHistory();

    return (
        <PatientPage
            assignedTestsResponse={assignedTestsResult}
            testResultsResponse={testsHistoryResult}
        />
    );
}