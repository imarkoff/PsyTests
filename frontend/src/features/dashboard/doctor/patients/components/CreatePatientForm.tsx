"use client";

import 'dayjs/locale/uk';
import useCreatePatientApi from "@/features/dashboard/doctor/patients/hooks/lib/useCreatePatientApi";
import CreateUserForm from "@/components/CreateUserForm";
import {Roles} from "@/types/enums/Role";

export default function CreatePatientForm({afterCreateAction}: {afterCreateAction?: () => void}) {
    const { onSubmit, loading, error } = useCreatePatientApi(afterCreateAction);

    return (
        <CreateUserForm
            action={{
                onSubmit: onSubmit,
                loading: loading,
                error: error
            }}
            userRole={Roles.patient}
        />
    );
}