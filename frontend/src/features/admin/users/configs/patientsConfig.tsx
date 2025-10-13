import dayjs from "dayjs";
import {createUser} from "@/lib/controllers/adminUsersController";
import {getPatients} from "@/lib/controllers/adminController";
import {Roles} from "@/types/enums/Role";
import UserEntityConfig from "../types/UserEntityConfig";
import UserCredentialsChip from "@/components/UserCredentialsChip";

const doctorsConfig: UserEntityConfig = {
    api: {
        getUsers: getPatients,
        createUser: createUser
    },
    role: Roles.patient,
    routing: {
        basePath: "/dashboard/admin/patients",
        detailPath: (id: string) => `/dashboard/admin/patients/${id}`
    },
    grid: {
        toolbar: {
            title: "Пацієнти, зареєстровані в системі",
            searchPlaceholder: "Пошук за ПІБ або телефоном",
            createButtonText: "Додати пацієнта"
        },
        extendedColumns: [
            {
                field: "registered_by",
                headerName: "Ким зареєстрований",
                width: 200,
                headerAlign: "center",
                align: "center",
                renderCell: ({ row }) => (
                    row.registered_by
                        ? <UserCredentialsChip userId={row.registered_by} format="compact" />
                        : "-"
                )
            },
            {
                field: "registered_at",
                headerName: "Дата реєстрації",
                width: 175,
                type: "dateTime",
                headerAlign: "center",
                align: "center",
                valueFormatter: (_, row) => row.registered_at
                    ? dayjs(row.registered_at).format("DD.MM.YYYY HH:mm")
                    : null,
            }
        ]
    }
};

export default doctorsConfig;