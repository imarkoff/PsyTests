import DoctorTestPage from "@/features/dashboard/doctor/tests/DoctorTestPage";

export default async function TestPage(
    {params}: { params: Promise<{ testId: string }> }
) {
    const {testId} = await params;

    return <DoctorTestPage testId={testId}/>;
}
