import AdminTestPage from "@/features/admin/tests/AdminTestPage";

export default async function TestPage(
    {params}: { params: Promise<{ testId: string }> }
) {
    const { testId } = await params;

    return (
        <AdminTestPage testId={testId} />
    );
}
