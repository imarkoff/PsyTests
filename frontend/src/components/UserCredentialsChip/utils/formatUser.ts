import User from "@/types/models/User";
import {UserRenderMode} from "@/components/UserCredentialsChip/types";

export default function formatUser (
    user: User,
    format: UserRenderMode
): string {
    if (format === "compact") {
        const surname = user.surname;
        const nameInitial = user.name ? `${user.name.charAt(0)}.` : '';
        const patronymicInitial = user.patronymic ? `${user.patronymic.charAt(0)}.` : '';
        return `${surname} ${nameInitial} ${patronymicInitial}`.trim();
    }

    return `${user.surname} ${user.name} ${user.patronymic ?? ''}`.trim();
}