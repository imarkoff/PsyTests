import PatientPage from "@/features/dashboard/doctor/patients/[patientId]/PatientPage";

export default async function Page({ params }: { params: Promise<{ patientId: string }> }) {
    const { patientId } = await params;

    return <PatientPage patientId={patientId} />;
}