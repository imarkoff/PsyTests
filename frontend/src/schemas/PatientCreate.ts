import {UserGender} from "@/schemas/User";
import {DateTime} from "luxon";

interface PaatientCreateBase {
    name: string;
    surname?: string;
    patronymic?: string;
    gender: UserGender
    phone: string;
    password: string;
}

export default interface PatientCreate extends PaatientCreateBase {
    birth_date: string; // ISO date string
}

export interface PatientCreateForm extends PaatientCreateBase {
    birth_date: DateTime;
}