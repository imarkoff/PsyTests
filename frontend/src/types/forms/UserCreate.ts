import {UserGender} from "@/types/models/User";
import {DateTime} from "luxon";
import {Roles} from "@/types/enums/Role";

interface UserCreateBase {
    name: string;
    surname?: string;
    patronymic?: string;
    gender: UserGender;
    phone: string;
    password: string;
    role: Roles;
}

export default interface UserCreate extends UserCreateBase {
    birth_date: string; // ISO date string
}

export interface UserCreateForm extends UserCreateBase {
    birth_date: DateTime;
}