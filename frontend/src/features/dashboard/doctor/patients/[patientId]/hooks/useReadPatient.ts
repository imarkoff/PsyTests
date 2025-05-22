import {useEffect} from "react";
import TestResult from "@/schemas/TestResult";
import DoctorPatient from "@/schemas/DoctorPatient";

export default function useReadPatient(
    doctorPatient: DoctorPatient | undefined,
    testResults: TestResult[] | undefined,
    onReadPatient: () => Promise<void>
) {
    const shouldRead = !!doctorPatient && !!testResults && doctorPatient.needs_attention;
    useEffect(() => {
        if (shouldRead) onReadPatient().then();
    }, [shouldRead, onReadPatient]);
}