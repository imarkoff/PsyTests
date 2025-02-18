import {useCallback, useEffect, useState} from "react";
import {findPatient} from "@/services/doctorPatientsService";
import PatientSearch from "@/schemas/PatientSearch";

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
            const data = await findPatient(query);
            setResults(data);
        }
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (query) {
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