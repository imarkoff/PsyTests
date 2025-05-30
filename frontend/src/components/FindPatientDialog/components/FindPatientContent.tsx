import {Box, Paper, Typography} from "@mui/material";
import FindInput from "@/components/FindPatientDialog/components/FindInput";
import CreatePatientDialog from "@/components/CreatePatientDialog/CreatePatientDialog";
import CreatePatientOpener from "@/components/FindPatientDialog/components/CreatePatientOpener";
import DoctorPatientsResults from "@/components/FindPatientDialog/components/DoctorPatientsResults";
import OtherPatientsResults from "@/components/FindPatientDialog/components/OtherPatientsResults";
import useFindPatientModal from "@/components/FindPatientDialog/hooks/useFindPatientModal";
import {FindPatientResults} from "@/components/FindPatientDialog/hooks/useFindPatient";

export default function FindPatientContent(
    {open, onClose}: { open: boolean, onClose: () => void }
) {
    const {
        searchRef, loading, results,
        handleClose, setQuery
    } = useFindPatientModal(open, onClose);

    return (
        <Paper sx={modalPaperStyles}>
            <Box sx={{width: "100%", display: "flex", gap: 2, alignItems: "center", p: 1, pb: 0}}>
                <FindInput searchRef={searchRef} setQuery={setQuery} loading={loading} />
            </Box>
            <Box sx={resultSectionStyles}>
                <PatientResultsHeader doctorPatients={results.doctorPatients} />
                <CreatePatientDialog OpenerAction={CreatePatientOpener} closeAction={handleClose} />
                <PatientResults {...results} />
            </Box>
        </Paper>
    );
}

const PatientResultsHeader = (
    {doctorPatients}: {doctorPatients: FindPatientResults["doctorPatients"]}
) => (
    <Typography variant={"h6"} fontWeight={500} sx={{
        alignSelf: "center", px: 1,
        visibility: doctorPatients === undefined ? "hidden" : "visible"
    }}>
        Результати пошуку
    </Typography>

);

const PatientResults = (
    {doctorPatients, otherPatients, isResultsEmpty}: FindPatientResults
) => (
    <>
        {isResultsEmpty && doctorPatients !== undefined && (
            <Typography
                variant={"body1"}
                color={"textSecondary"}
                sx={{gridColumn: "1 / -1", textAlign: "center", py: 2}}
            >
                Нічого не знайдено
            </Typography>
        )}

        {!!doctorPatients?.length && <DoctorPatientsResults patients={doctorPatients} />}
        {!!otherPatients?.length && <OtherPatientsResults patients={otherPatients} />}
    </>
);

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
};

const resultSectionStyles = {
    display: "grid", gap: 1,
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    maxHeight: 500,
    overflowY: "auto",
    p: 1
};