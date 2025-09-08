import {Role} from "@/types/enums/Role";

export default interface User {
    id: string;
    name: string;
    surname?: string;
    gender: UserGender
    patronymic?: string;
    birth_date: string;
    phone: string;
    role: Role;
    last_login: string | null;
}

export type UserGender = "male" | "female";