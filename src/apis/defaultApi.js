import axios from "axios";
const BASE_URL = "https://diskusiju-forumas-89f8e927e19e.herokuapp.com"

export default axios.create({
    baseURL: BASE_URL
});

export const PrivateApi = axios.create({
    baseURL: BASE_URL,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});