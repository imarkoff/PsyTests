import { AxiosInstance } from "axios";
import User from "@/types/models/User";
import PaginatedList from "@/types/pagination/PaginatedList";
import PaginationParams from "@/types/pagination/PaginationParams";
import convertPaginationParamsToQuery from "@/utils/convertPaginationParamsToQuery";

export default class AdminService {
    constructor(
        private readonly api: AxiosInstance
    ) {
    }

    endpoint = "/admin";

    getDoctors = async (
        paginationParams: PaginationParams<User>
    ) =>
        await this.api.get<PaginatedList<User>>(`${this.endpoint}/doctors`, {
            params: convertPaginationParamsToQuery(paginationParams)
        })
            .then(response => response.data)

    getPatients = async (
        paginationParams: PaginationParams<User>
    ) =>
        await this.api.get<PaginatedList<User>>(`${this.endpoint}/patients`, {
            params: convertPaginationParamsToQuery(paginationParams)
        })
            .then(response => response.data)
}