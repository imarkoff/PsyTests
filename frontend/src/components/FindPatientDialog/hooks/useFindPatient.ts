"use client";

import {useCallback, useEffect, useState} from "react";
import PatientSearch from "@/types/dtos/PatientSearch";
import {findPatient} from "@/lib/controllers/doctorPatientController";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";
import useDebounce from "@/hooks/useDebounce";

export interface FindPatientResults {
    doctorPatients?: PatientSearch["doctor_patients"];
    otherPatients?: PatientSearch["patients"];
    isResultsEmpty: boolean;
}

export default function useFindPatient() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [results, setResults] = useState<PatientSearch>();

    const doctorPatients = results?.doctor_patients;
    const otherPatients = results?.patients;
    const isResultsEmpty = !doctorPatients?.length && !otherPatients?.length;

    const [query, setQuery] = useState("");

    const handleSearch = useCallback(async (query: string) => {
        setLoading(true);
        try {
            const data = await withSafeErrorHandling(findPatient)(query);
            setResults(data);
        }
        catch (error) {
            if (error instanceof Error) setError(error.message);
            else setError("Трапилась невідома помилка при пошуку пацієнта");
        }
        finally {
            setLoading(false);
        }
    }, []);

    const debouncedSearch = useDebounce(query, 200);
    useEffect(() => {
        if (debouncedSearch.length > 0) {
            handleSearch(debouncedSearch).then();
        }
    }, [debouncedSearch, handleSearch]);

    const clearResults = () => setResults(undefined);

    return {
        loading, error,
        results: {
            doctorPatients,
            otherPatients,
            isResultsEmpty,
        } as FindPatientResults,
        setQuery,
        clearResults
    };
}