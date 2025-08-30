import {AxiosInstance} from "axios";
import UserCreate from "@/types/forms/UserCreate";
import User from "@/types/models/User";

export default class AdminUsersService {
    constructor(
        private readonly api: AxiosInstance
    ) {
    }

    endpoint = "/admin/users";

    createUser = async (userCreate: UserCreate) =>
        this.api.post<User>(this.endpoint,  userCreate).then(res => res.data);

}