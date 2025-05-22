"use client";

import {useCallback, useEffect, useState} from "react";
import PatientSearch from "@/schemas/PatientSearch";
import {findPatient} from "@/lib/controllers/doctorPatientController";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";

export default function useFindPatient() {
    const [loading, setLoading] = useState(false);
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
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (query.length > 0) {
                handleSearch(query).then();
            }
        }, 200);

        return () => {
            clearTimeout(handler);
        };
    }, [query, handleSearch]);

    const clearResults = () => setResults(undefined);

    return {
        loading,
        doctorPatients,
        otherPatients,
        isResultsEmpty,
        setQuery,
        clearResults
    };
}