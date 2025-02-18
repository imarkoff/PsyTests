import {Typography} from "@mui/material";
import DoctorPatientCard from "@/app/dashboard/doctor/patients/components/DoctorPatientCard";
import DoctorPatient from "@/schemas/DoctorPatient";

export default function DoctorPatientsResults({patients}: {patients: DoctorPatient[]}) {
    const activePatients = patients.filter(patient => patient.is_active);
    const inactivePatients = patients.filter(patient => !patient.is_active);

    return (
        <>
            {activePatients.length > 0 && (
                <Typography variant={"body1"} color={"textSecondary"} sx={{gridColumn: "1 / -1", px: 1}}>
                    Пацієнти на вашому обліку
                </Typography>
            )}
            {activePatients.map(patient => (
                <DoctorPatientCard patient={patient} key={patient.id} />
            ))}

            {inactivePatients.length > 0 && (
                <Typography variant={"body1"} color={"textSecondary"} sx={{gridColumn: "1 / -1", px: 1}}>
                    Виписані пацієнти
                </Typography>
            )}
            {inactivePatients.map(patient => (
                <DoctorPatientCard patient={patient} key={patient.id} />
            ))}
        </>
    );
}