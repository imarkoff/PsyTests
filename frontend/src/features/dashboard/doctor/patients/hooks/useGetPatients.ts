import useSWR from "swr";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";
import {getAllPatients} from "@/lib/controllers/doctorPatientController";
import { useMemo } from "react";

/**
 * Gets all patients from the server.
 * Filters patients into two groups: those who need attention and those who don't.
 * Automatically handles loading and error states.
 */
export default function useGetPatients() {
    const {
        data: patients,
        isLoading,
        error: swrError
    } = useSWR("getAllPatients", withSafeErrorHandling(getAllPatients));

    const needsAttention = useMemo(() => (
        patients?.filter(patient => patient.needs_attention)
    ), [patients]);

    const normalPatients = useMemo(() => (
        patients?.filter(patient => !patient.needs_attention)
    ), [patients]);

    const error = swrError ? (
        swrError instanceof Error
            ? swrError.message
            : swrError.toString()
    ) : undefined;

    return {
        allPatients: patients,
        normalPatients,
        needsAttention,
        isLoading,
        error
    };
}