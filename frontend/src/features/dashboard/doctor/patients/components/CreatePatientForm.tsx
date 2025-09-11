"use client";

import 'dayjs/locale/uk';
import useCreatePatientApi from "../hooks/lib/useCreatePatientApi";
import {Roles} from "@/types/enums/Role";
import UserFormDialog from "@/components/UserForm";

export default function CreatePatientForm(
    {afterCreateAction}: { afterCreateAction?: () => void }
) {
    const {onSubmit, loading, error} = useCreatePatientApi(afterCreateAction);

    return (
        <UserFormDialog.Create
            onSubmit={onSubmit}
            loading={loading}
            error={error}
            userRole={Roles.patient}
        />
    );
}