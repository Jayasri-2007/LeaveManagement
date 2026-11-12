
import axios from "axios";

const API = axios.create({
    baseURL: "https://leave-management-api-j0vo.onrender.com/api"
});

export default API;
