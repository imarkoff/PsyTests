import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",  // TODO: Use env variable
    headers: {
        "Content-Type": "application/json",
    },
})

export default api;