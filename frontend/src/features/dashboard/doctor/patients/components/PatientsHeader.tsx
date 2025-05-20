import {Box, Typography} from "@mui/material";
import FindPatientModal from "@/components/FindPatient/FindPatientModal";

export default function PatientsHeader() {
    return (
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
    );
}