import {AxiosInstance} from "axios";
import UserCreate from "@/types/forms/UserCreate";
import User from "@/types/models/User";
import {UserUpdateDto} from "@/types/forms/UserUpdate";

export default class AdminUsersService {
    constructor(
        private readonly api: AxiosInstance
    ) {
    }

    endpoint = "/admin/users";

    createUser = async (userCreate: UserCreate) =>
        this.api.post<User>(this.endpoint,  userCreate)
            .then(res => res.data);

    getUser = async (id: string) =>
        this.api.get<User>(`${this.endpoint}/${id}`)
            .then(res => res.data);

    updateUser = async (id: string, userUpdate: UserUpdateDto) =>
        this.api.put<User>(`${this.endpoint}/${id}`, userUpdate)
            .then(res => res.data);

    changeUserPassword = async (id: string, newPassword: string) =>
        this.api.patch<void>(
            `${this.endpoint}/${id}/password`,
            newPassword,
            {
                headers: {'Content-Type': 'text/plain'}
            }
        )
            .then(res => res.data);

    deleteUser = async (userId: string) =>
        this.api.delete<void>(`${this.endpoint}/${userId}`)
            .then(res => res.data);
}