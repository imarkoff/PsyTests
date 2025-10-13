import PassTestPage from "@/features/dashboard/patient/tests/PassTestsPage";

export default async function Page({ params }: {
    params: Promise<{ testId: string; assignedTestId: string }>
}) {
    const { testId, assignedTestId } = await params;

    return (
        <PassTestPage
            testId={testId}
            assignedTestId={assignedTestId}
        />
    );
}