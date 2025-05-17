import {AxiosInstance} from "axios";
import UserLogin from "@/schemas/UserLogin";

export default class AuthService {
    constructor(private readonly api: AxiosInstance) {}

    endpoint = "/auth";

    async login(data: UserLogin) {
        const { data: token, headers } = await this.api.post<string>(`${this.endpoint}/login`, data);
        return {
            token,
            setCookieHeader: headers["set-cookie"]
        };
    }

    async logout() {
        const { headers } = await this.api.post<void>(`${this.endpoint}/logout`);
        return {
            setCookieHeader: headers["set-cookie"]
        }
    }
}