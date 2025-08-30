import useSWR from "swr";
import {getAllPatients} from "@/lib/controllers/doctorPatientController";
import { useMemo } from "react";

/**
 * Gets all patients from the server.
 * Filters patients into two groups: those who need attention and those who don't.
 * Automatically handles loading and error states.
 */
export default function useGetPatientsApi() {
    const {
        data: response,
        isLoading,
    } = useSWR("getAllPatients", getAllPatients);

    const allPatients = response?.data;

    const needsAttention = useMemo(() => (
        allPatients?.filter(patient => patient.needs_attention)
    ), [allPatients]);

    const normalPatients = useMemo(() => (
        allPatients?.filter(patient => !patient.needs_attention)
    ), [allPatients]);

    return {
        allPatients,
        normalPatients,
        needsAttention,
        isLoading,
        error: response?.error?.statusText
    };
}