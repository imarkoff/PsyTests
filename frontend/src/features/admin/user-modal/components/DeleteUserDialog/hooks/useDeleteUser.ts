import useUserContext from "@/features/admin/user-modal/hooks/useUserContext";
import useUsersTriggerContext from "@/features/admin/user-modal/hooks/useUsersTriggerContext";
import useDeleteUserByAdminApi from "@/features/admin/user-modal/hooks/lib/useDeleteUserByAdminApi";

export default function useDeleteUser(
    afterDelete: () => void
) {
    const {user} = useUserContext();
    const {trigger} = useUsersTriggerContext();

    const {
        deleteUserByAdmin,
        isMutating,
        error,
    } = useDeleteUserByAdminApi();

    const handleDelete = async () => {
        if (!user) return;

        const response = await deleteUserByAdmin(user.id);

        if (response.success) {
            afterDelete();
            trigger?.();
        }
    };

    return {
        handleDelete,
        isMutating,
        error,
    }
}