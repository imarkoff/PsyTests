import {Role} from "@/schemas/Role";

export default interface User {
    id: string;
    name: string;
    surname?: string;
    phone: string;
    role: Role;
}