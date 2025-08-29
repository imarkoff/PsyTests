import { AxiosInstance } from "axios";
import User from "@/schemas/User";
import PaginatedList from "@/schemas/PaginatedList";
import PaginationParams from "@/schemas/PaginationParams";

export default class AdminService {
    constructor(
        private readonly api: AxiosInstance
    ) {
    }

    endpoint = "/admin";

    getDoctors = async (paginationParams: PaginationParams) =>
        await this.api.get<PaginatedList<User>>(`${this.endpoint}/doctors`, {
            params: paginationParams
        })
            .then(response => response.data)

    getPatients = async (paginationParams: PaginationParams) =>
        await this.api.get<PaginatedList<User>>(`${this.endpoint}/patients`, {
            params: paginationParams
        })
            .then(response => response.data)
}