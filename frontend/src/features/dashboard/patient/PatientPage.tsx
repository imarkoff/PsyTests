import TestsLayout from "@/features/dashboard/patient/layout/TestsLayout";
import TestsResultsLayout from "@/features/dashboard/patient/layout/TestsResultsLayout";
import {ApiResponse} from "@/lib/api-client/types";
import PatientTest from "@/schemas/PatientTest";
import TestResultShort from "@/schemas/TestResultShort";

interface PatientPageProps {
    assignedTestsResponse: ApiResponse<PatientTest[]>;
    testResultsResponse: ApiResponse<TestResultShort[]>;
}

export default function PatientPage(
    {assignedTestsResponse, testResultsResponse}: PatientPageProps
) {
    return (
        <>
            <TestsLayout assignedTestsResponse={assignedTestsResponse} />
            <TestsResultsLayout testResultsResponse={testResultsResponse} />
        </>
    );
}