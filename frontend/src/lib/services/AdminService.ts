import { AxiosInstance } from "axios";
import User from "@/types/models/User";
import PaginatedList from "@/types/pagination/PaginatedList";
import QueryPaginationParams from "@/types/pagination/QueryPaginationParams";

export default class AdminService {
    constructor(
        private readonly api: AxiosInstance
    ) {
    }

    endpoint = "/admin";

    getDoctors = async (
        queryPaginationParams: QueryPaginationParams
    ) =>
        await this.api.get<PaginatedList<User>>(`${this.endpoint}/doctors`, {
            params: queryPaginationParams
        })
            .then(response => response.data)

    getPatients = async (
        queryPaginationParams: QueryPaginationParams
    ) =>
        await this.api.get<PaginatedList<User>>(`${this.endpoint}/patients`, {
            params: queryPaginationParams
        })
            .then(response => response.data)
}