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
    registered_by?: string; // UUID
    registered_at?: string; // ISO date
}

export type UserGender = "male" | "female";