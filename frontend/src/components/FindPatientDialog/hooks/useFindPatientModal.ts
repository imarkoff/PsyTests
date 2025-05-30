import {useEffect, useRef} from "react";
import useFindPatient from "@/components/FindPatientDialog/hooks/useFindPatient";

export default function useFindPatientModal(open: boolean, onClose: () => void) {
    const searchRef = useRef<HTMLInputElement>(null);
    const {loading, error, results, clearResults, setQuery} = useFindPatient();

    const handleClose = () => {
        onClose();
        setQuery("");
        clearResults();
    };

    // searchRef may not be immediately available when the modal opens,
    // so we use a timeout to ensure it is focused after the modal is rendered.
    useEffect(() => {
        if (open) {
            const timeout = setTimeout(() => {
                searchRef.current?.focus();
            }, 50);
            return () => {
                clearTimeout(timeout);
            }
        }
    }, [open]);

    return {
        searchRef, loading, error, results,
        handleClose, setQuery
    }
}