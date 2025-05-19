import axios, {CreateAxiosDefaults} from "axios";

/**
 * Creates an Axios instance for making API requests.
 * @param config - Optional additional configuration for the Axios instance.
 */
export default function createApiInstance(config?: CreateAxiosDefaults) {
    return axios.create({
        baseURL: process.env.API_URL,
        headers: {
            "Content-Type": "application/json",
        },
        ...config,
    });
}

export const defaultApi = createApiInstance();