import {createUser} from "@/lib/controllers/adminUsersController";
import {getDoctors} from "@/lib/controllers/adminController";
import {Roles} from "@/types/enums/Role";
import UserEntityConfig from "../types/UserEntityConfig";

const doctorsConfig: UserEntityConfig = {
    api: {
        getUsers: getDoctors,
        createUser: createUser
    },
    role: Roles.doctor,
    routing: {
        basePath: "/dashboard/admin/doctors",
        detailPath: (id: string) => `/dashboard/admin/doctors/${id}`
    },
    grid: {
        toolbar: {
            title: "Лікарі, зареєстровані в системі",
            searchPlaceholder: "Пошук за ПІБ або телефоном",
            createButtonText: "Додати лікаря"
        }
    }
};

export default doctorsConfig;