import PassTestPage from "@/features/dashboard/patient/tests/[testId]/[assignedTestId]/PassTestPage";

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