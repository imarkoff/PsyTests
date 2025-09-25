import User from "@/types/models/User";
import {useState} from "react";
import useChangeUserPasswordApi from "@/features/admin/user-modal/hooks/lib/useChangeUserPasswordApi";

export default function usePasswordForm(
    user: User | null,
    afterPasswordChange: () => void
) {
    const [password, setPassword] = useState("");

    const {
        response, isMutating,
        handleChangeUserPassword, reset
    } = useChangeUserPasswordApi();

    const handleSubmit = async () => {
        if (!user) return;

        const response = await handleChangeUserPassword(user.id, password);
        if (!response.success) return;

        resetForm();
        afterPasswordChange();
    };

    const resetForm = () => {
        setPassword("");
        reset();
    }

    return {
        response, isMutating,
        password, setPassword,
        handleSubmit
    };
}