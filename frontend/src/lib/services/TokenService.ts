import {AxiosInstance} from "axios";

export default class TokenService {
    constructor(private readonly api: AxiosInstance) {}

    endpoint = "/token";

    async refreshToken(cookies: string) {
        const { data } = await this.api.post<string>(`${this.endpoint}/refresh`, {}, {
            headers: { Cookie: cookies },
            withCredentials: true
        });
        return data;
    }
}