import {Box} from "@mui/material";
import DoctorPatient from "@/schemas/DoctorPatient";
import PatientHeaderInfo from "@/features/dashboard/doctor/patients/[patientId]/layout/PatientHeader/PatientHeaderInfo";
import ChangeStatusButton from "@/features/dashboard/doctor/patients/[patientId]/components/ChangeStatusButton";
import DeletePatientButton from "@/features/dashboard/doctor/patients/[patientId]/components/DeletePatientButton";

interface PatientHeaderProps {
    doctorPatient?: DoctorPatient | undefined;
    onChangeStatus: (isActive: boolean) => Promise<void>;
}

export default function PatientHeader({doctorPatient, onChangeStatus}: PatientHeaderProps) {
    const patient = doctorPatient?.patient;

    return (
        <Box sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            flexDirection: {xs: "column", sm: "row"},
            columnGap: 2,
            rowGap: 1,
            borderBottom: 1,
            borderColor: "divider",
            pb: 6,
        }}>
            <PatientHeaderInfo doctorPatient={doctorPatient} />
            <Box sx={{display: "flex", gap: 1, flexWrap: "wrap", ml: {sm: "auto"}}}>
                <ChangeStatusButton patient={doctorPatient} changeAction={onChangeStatus} />
                <DeletePatientButton patientId={patient?.id} />
            </Box>
        </Box>
    );
}