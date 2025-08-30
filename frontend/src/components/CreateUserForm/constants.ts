import {Roles} from "@/types/enums/Role";

export const CREATE_USER_BY_ROLE: Record<Roles, string> = {
    [Roles.patient]: "Створити пацієнта",
    [Roles.doctor]: "Створити лікаря",
    [Roles.admin]: "Створити адміністратора"
}