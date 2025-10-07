import TestContent from "@/features/tests-page/[testId]/TestContent";

export default async function TestPage(
    {params}: { params: Promise<{ testId: string }> }
) {
    const { testId } = await params;

    return <TestContent testId={testId} />;
}
