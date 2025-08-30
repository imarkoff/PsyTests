import {useState} from "react";
import PassTestData from "@/features/dashboard/patient/tests/[testId]/[assignedTestId]/schemas/PassTestData";
import PassTest from "@/types/forms/PassTest";
import {passTest} from "@/lib/controllers/patientTestController";
import TestBase from "@/types/models/TestBase";

export default function useOnPassTest(test: TestBase | undefined, assignedTestId: string) {
    const [passed, setPassed] = useState(false);
    const [loading, setLoading] = useState(false);

    /** Function to handle passing the test. */
    const onPass = async (data: PassTestData) => {
        if (!test || loading) return;
        setLoading(true);

        try {
            const testData: PassTest = {
                assigned_test_id: assignedTestId,
                answers: convertEmptyStringsToNull(data)
            }
            await passTest(testData);
            setPassed(true);
        }
        finally {
            setLoading(false);
        }
    }

    return { onPass, passed, loading };
}

const convertEmptyStringsToNull = (data: PassTestData) => (
    Object.keys(data).reduce((acc, pathName) => {
        acc[pathName] = data[pathName].map(answerId => answerId === "" ? null : answerId);
        return acc;
    }, {} as PassTest["answers"])
);