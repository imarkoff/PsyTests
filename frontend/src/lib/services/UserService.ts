import {AxiosInstance} from "axios";
import User from "@/schemas/User";

export default class UserService {
    constructor(private readonly api: AxiosInstance) {}

    endpoint = "/users";

    async getMe() {
        const { data } = await this.api.get<User>(`${this.endpoint}/me`);
        return data;
    }

    async getUser(userId: string) {
        const { data } = await this.api.get<User>(`${this.endpoint}/${userId}`);
        return data;
    }
}