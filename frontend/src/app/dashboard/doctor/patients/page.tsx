import {Box, Typography} from "@mui/material";
import PatientEntities from "@/app/dashboard/doctor/patients/layout/PatientEntities";
import AddPatientLayout from "@/app/dashboard/doctor/patients/layout/AddPatientLayout";
import PatientsProvider from "@/app/dashboard/doctor/patients/context/PatientsProvider";

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
                    gridTemplateColumns: {xs: "1fr", sm: "1fr 1fr"},
                    minWidth: {xs: "100%", sm: "auto"}
                }}>
                    <Typography
                        variant="h5"
                        fontWeight={600}
                        sx={{ textAlign: "center", marginBottom: 1, gridColumn: "1 / -1" }}
                    >
                        Ваші пацієнти
                    </Typography>
                    <PatientEntities />
                </Box>

                <AddPatientLayout />
            </Box>
        </PatientsProvider>
    );
}