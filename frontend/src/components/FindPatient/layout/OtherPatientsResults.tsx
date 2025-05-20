import User from "@/schemas/User";
import {Typography} from "@mui/material";
import OtherPatientCard from "@/features/dashboard/doctor/patients/components/PatientCard/OtherPatientCard";

export default function OtherPatientsResults({patients}: {patients: User[]}) {
    return (
        <>
            <Typography variant={"body1"} color={"textSecondary"} sx={{gridColumn: "1 / -1", px: 1}}>
                Інші пацієнти
            </Typography>
            {patients.map(patient => (
                <OtherPatientCard patient={patient} key={patient.id} />
            ))}
        </>
    );
}