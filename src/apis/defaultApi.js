import axios from "axios";
const BASE_URL = "http://localhost:5000"

export default axios.create({
    baseUrl: BASE_URL
});

export const PrivateApi = axios.create({
    baseUrl: BASE_URL,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});