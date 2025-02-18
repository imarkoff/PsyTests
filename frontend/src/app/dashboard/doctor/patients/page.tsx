import {Box, Typography} from "@mui/material";
import PatientEntities from "@/app/dashboard/doctor/patients/layout/PatientEntities";
import PatientsProvider from "@/app/dashboard/doctor/patients/context/PatientsProvider";
import FindPatientModal from "@/components/FindPatient/FindPatientModal";

export default function Page() {
    return (
        <PatientsProvider>
            <Box sx={{
                display: "flex",
                justifyContent: "space-evenly",
                flexWrap: "wrap-reverse",
                alignItems: "center",
                gap: 1,
                flexGrow: 1
            }}>
                <Box sx={{
                    display: "grid",
                    gap: 1,
                    gridTemplateColumns: {xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr"},
                    minWidth: {xs: "100%", sm: "auto"}
                }}>
                    <Box sx={{
                        gridColumn: "1 / -1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: {xs: "center", sm: "space-between"},
                        flexDirection: {xs: "column", sm: "row"},
                        flexWrap: "wrap",
                        marginBottom: 1,
                        gap: 1
                    }}>
                        <Typography variant="h5">
                            Пацієнти на вашому обліку
                        </Typography>
                        <FindPatientModal />
                    </Box>
                    <PatientEntities />
                </Box>
            </Box>
        </PatientsProvider>
    );
}