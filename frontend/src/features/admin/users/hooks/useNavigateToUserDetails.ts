import useUsersContext from "@/features/admin/users/hooks/useUsersContext";
import {useRouter} from "next/navigation";

export default function useNavigateToUserDetails() {
    const router = useRouter();
    const { routing: {detailPath} } = useUsersContext();

    return (userId: string) => {
        router.push(detailPath(userId));
    };
}