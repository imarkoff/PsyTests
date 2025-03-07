export enum Roles {
    patient = "patient",
    doctor = "doctor",
    admin = "admin"
}

export type Role = keyof typeof Roles;