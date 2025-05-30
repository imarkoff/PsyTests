import {useState} from "react";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";
import {addPatient} from "@/lib/controllers/doctorPatientController";

export default function useAddPatient(patientId: string) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePutOnRecord = async () => {
        if (loading || success) return;
        setLoading(true);
        try {
            await withSafeErrorHandling(addPatient)(patientId);
            setSuccess(true);
        }
        finally {
            setLoading(false);
        }
    }

    return {
        loading,
        success,
        handlePutOnRecord
    };
}