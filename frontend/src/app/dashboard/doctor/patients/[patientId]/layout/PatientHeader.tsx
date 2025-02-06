import User from "@/schemas/User";
import {Box, Typography} from "@mui/material";
import formatPhone from "@/utils/formatPhone";
import DeletePatientButton from "@/app/dashboard/doctor/patients/[patientId]/components/DeletePatientButton";

export default function PatientHeader({patient}: {patient?: User}) {
    return (
        <Box sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: {xs: "center", sm: "baseline"},
            flexDirection: {xs: "column", sm: "row"},
            justifyContent: {xs: "center", sm: "flex-start"},
            columnGap: 3,
            rowGap: 0.5,
            borderBottom: 1,
            borderColor: "divider",
            pb: 6,
        }}>
            <Typography id="modal-title" variant="h4" component="h2" fontWeight={600}>
                {patient?.name} {patient?.surname && patient.surname}
            </Typography>

            <Typography variant={"subtitle1"} color={"textSecondary"}>
                {patient?.phone && formatPhone(patient.phone)}
            </Typography>

            {patient && <DeletePatientButton patientId={patient.id} />}
        </Box>
    );
}