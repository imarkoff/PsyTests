import TestContent from "@/features/dashboard/doctor/tests/[testId]/TestContent";

export default async function TestPage(
    {params}: { params: Promise<{ testId: string }> }
) {
    const { testId } = await params;

    return <TestContent testId={testId} />;
}
