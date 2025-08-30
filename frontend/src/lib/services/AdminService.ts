import { AxiosInstance } from "axios";
import User from "@/types/models/User";
import PaginatedList from "@/types/PaginatedList";
import PaginationParams from "@/types/PaginationParams";

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