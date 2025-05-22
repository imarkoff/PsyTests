import PatientCard from "@/components/PatientCard/PatientCard";
import DialogContent from "@mui/material/DialogContent";
import DoctorPatient from "@/schemas/DoctorPatient";
import User from "@/schemas/User";

interface AssignContentProps {
    patients: DoctorPatient[] | undefined;
    onChoose: (patient: User) => void;
    selectedPatient: User | undefined;
}

export default function AssignContent({patients, onChoose, selectedPatient}: AssignContentProps) {
    return (
        <DialogContent sx={{
            p: 1,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(275px, 1fr))",
            gap: 1
        }} dividers>
            {patients?.map((patient) => (
                <PatientCard
                    patient={patient.patient}
                    key={patient.patient.id}
                    onClick={onChoose}
                    selected={patient.patient.id === selectedPatient?.id}
                />
            ))}
        </DialogContent>
    );
}