import UserModal from "@/features/admin/user-modal/UserModal";

export default async function PatientPage(
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;

    return (
        <UserModal
            userId={userId}
            backRoute={"/dashboard/admin/patients"}
        />
    );
}