import {Box} from "@mui/material";
import PatientEntities from "@/features/dashboard/doctor/patients/components/PatientEntities";
import PatientsProvider from "@/features/dashboard/doctor/patients/contexts/PatientsProvider";
import PatientsHeader from "@/features/dashboard/doctor/patients/components/PatientsHeader";

export default function DoctorPatientsPage() {
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
                    maxWidth: "1200px",
                    width: "100%",
                }}>
                    <PatientsHeader />
                    <PatientEntities />
                </Box>
            </Box>
        </PatientsProvider>
    );
}