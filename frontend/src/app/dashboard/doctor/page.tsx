import PatientsProvider from "@/app/dashboard/doctor/context/PatientsProvider";
import {Box, Typography} from "@mui/material";
import PatientEntities from "@/app/dashboard/doctor/layout/PatientEntities";
import AddPatientLayout from "@/app/dashboard/doctor/layout/AddPatientLayout";

export default function DoctorPage() {
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
                <Box sx={{display: "grid", gap: 1, minWidth: {xs: "100%", sm: 400}}}>
                    <Typography variant="h5" fontWeight={600} sx={{textAlign: "center", marginBottom: 1}}>
                        Ваші пацієнти
                    </Typography>
                    <PatientEntities />
                </Box>
                <AddPatientLayout />
            </Box>
        </PatientsProvider>
    );
}