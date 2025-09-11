import {UserGender} from "@/types/models/User";
import {DateTime} from "luxon";

interface UserUpdateBase {
    name: string;
    surname?: string;
    patronymic?: string;
    gender: UserGender;
    birth_date: string | DateTime;
    phone: string;
}

export default interface UserUpdate extends UserUpdateBase {
    birth_date: DateTime;
}

export interface UserUpdateDto extends UserUpdateBase {
    birth_date: string;
}