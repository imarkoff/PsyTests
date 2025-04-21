import {Role} from "@/schemas/Role";

export default interface User {
    id: string;
    name: string;
    surname?: string;
    gender: UserGender
    patronymic?: string;
    birth_date: string;
    phone: string;
    role: Role;
}

export type UserGender = "male" | "female";