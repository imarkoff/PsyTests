import UserModal from "@/features/admin/user-modal/UserModal";
import {getUser} from "@/lib/controllers/adminUsersController";

export default async function DoctorPage(
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;

    const user = await getUser(userId);

    return (
        <UserModal
            userResponse={user}
            backRoute={"/dashboard/admin/doctors"}
        />
    );
}