import {AxiosInstance} from "axios";
import User from "@/types/models/User";
import PaginatedList from "@/types/pagination/PaginatedList";
import QueryPaginationParams from "@/types/pagination/QueryPaginationParams";
import PatientTest from "@/types/models/PatientTest";

export default class AdminService {
    constructor(
        private readonly api: AxiosInstance
    ) {
    }

    endpoint = "/admin";

    getDoctors = async (
        queryPaginationParams: QueryPaginationParams
    ) =>
        await this.api.get<PaginatedList<User>>(
            `${this.endpoint}/doctors`,
            {params: queryPaginationParams}
        )
            .then(response => response.data)

    getDoctorAssignedTests = async (
        doctorId: string,
        queryPaginationParams: QueryPaginationParams
    ) =>
        await this.api.get<PaginatedList<PatientTest>>(
            `${this.endpoint}/doctors/${doctorId}/tests`,
            {params: queryPaginationParams}
        )
            .then(response => response.data)

    getPatients = async (
        queryPaginationParams: QueryPaginationParams
    ) =>
        await this.api.get<PaginatedList<User>>(
            `${this.endpoint}/patients`,
            {params: queryPaginationParams}
        )
            .then(response => response.data)
}