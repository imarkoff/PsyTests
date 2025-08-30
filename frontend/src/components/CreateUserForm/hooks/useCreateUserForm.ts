import {useForm, UseFormReturn} from "react-hook-form";
import UserCreate, {UserCreateForm} from "@/types/forms/UserCreate";
import {Roles} from "@/types/enums/Role";

interface UseCreateUserFormReturn extends Omit<UseFormReturn<UserCreateForm>, 'handleSubmit'> {
    handleFormSubmit: () => void;
}

export default function useCreateUserForm(
    onSubmit: (data: UserCreate) => void,
    userRole: Roles
): UseCreateUserFormReturn {
    const {handleSubmit, ...methods} = useForm<UserCreateForm>({
        defaultValues: {
            role: userRole,
        }
    });

    const handleFormSubmit = handleSubmit((data) => {
        const transformedBirthdate = data.birth_date.toISODate();

        if (!transformedBirthdate) {
            throw new Error("Невірний формат дати.");
        }

        const transformedData: UserCreate = {
            ...data,
            birth_date: transformedBirthdate,
        };

        onSubmit(transformedData);
    });

    return {
        ...methods,
        handleFormSubmit
    };
}