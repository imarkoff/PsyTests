export default interface PatientCreate {
    name: string;
    surname?: string;
    patronymic?: string;
    birth_date: string;
    phone: string;
    password: string;
}