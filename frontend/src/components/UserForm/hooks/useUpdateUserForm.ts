import {useForm} from "react-hook-form";
import UserUpdate from "@/types/forms/UserUpdate";
import {DateTime} from "luxon";
import User from "@/types/models/User";

export default function useUpdateUserForm(
    currentUser: User,
    onSubmit: (data: UserUpdate) => void
) {
    const methods = useForm<UserUpdate>({
        defaultValues: {
            surname: currentUser.surname,
            name: currentUser.name,
            patronymic: currentUser.patronymic,
            birth_date: DateTime.fromISO(currentUser.birth_date),
            gender: currentUser.gender,
            phone: currentUser.phone
        }
    });

    const injectedFormSubmit = methods.handleSubmit(onSubmit);

    return {
        methods,
        injectedFormSubmit
    };
}