import {UserGender} from "@/types/models/User";
import {DateTime} from "luxon";

interface PatientCreateBase {
    name: string;
    surname?: string;
    patronymic?: string;
    gender: UserGender
    phone: string;
    password: string;
}

export default interface PatientCreate extends PatientCreateBase {
    birth_date: string; // ISO date string
}

export interface PatientCreateForm extends PatientCreateBase {
    birth_date: DateTime;
}