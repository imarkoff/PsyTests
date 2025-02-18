"use client";

import {
    Box,
    Modal,
    Paper,
    Typography
} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import FindInput from "@/components/FindPatient/components/FindInput";
import useFindPatient from "@/components/FindPatient/useFindPatient";
import FindModalOpener from "@/components/FindPatient/components/FindModalOpener";
import DoctorPatientsResults from "@/components/FindPatient/layout/DoctorPatientsResults";
import OtherPatientsResults from "@/components/FindPatient/layout/OtherPatientsResults";
import CreatePatientOpener from "@/components/FindPatient/components/CreatePatientOpener";
import CreatePatientModal from "@/components/CreatePatient/CreatePatientModal";

/**
 * Modal for finding patients.
 * @constructor
 */
export default function FindPatientModal() {
    const [open, setOpen] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const {loading, doctorPatients, otherPatients, isResultsEmpty, clearResults, setQuery} = useFindPatient();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setQuery("");
        clearResults();
    };

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                searchRef.current?.focus();
            }, 50);
        }
    }, [open]);

    return (
        <div>
            <FindModalOpener handleOpen={handleOpen} />
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Paper sx={modalPaperStyles}>
                    <Box sx={{width: "100%", display: "flex", gap: 2, alignItems: "center", p: 1, pb: 0}}>
                        <FindInput searchRef={searchRef} setQuery={setQuery} loading={loading} />
                    </Box>
                    <Box sx={{
                        display: "grid", gap: 1,
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        maxHeight: 500,
                        overflowY: "auto",
                        p: 1
                    }}>
                        <Typography variant={"h6"} fontWeight={500} sx={{
                            alignSelf: "center", px: 1,
                            visibility: doctorPatients === undefined ? "hidden" : "visible"
                        }}>
                            Результати пошуку
                        </Typography>

                        <CreatePatientModal OpenerAction={CreatePatientOpener} closeAction={handleClose} />

                        {isResultsEmpty && doctorPatients !== undefined && (
                            <Typography variant={"body1"} color={"textSecondary"} sx={{gridColumn: "1 / -1", textAlign: "center", py: 2}}>
                                Нічого не знайдено
                            </Typography>
                        )}

                        {!!doctorPatients?.length && <DoctorPatientsResults patients={doctorPatients} />}
                        {!!otherPatients?.length && <OtherPatientsResults patients={otherPatients} />}
                    </Box>
                </Paper>
            </Modal>
        </div>
    );
}

const modalPaperStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 720,
    width: '100%',
    backgroundColor: 'background.paper',
    border: '2px solid',
    borderColor: 'divider',
    boxShadow: 24,
    display: "grid",
    borderRadius: 4,
}