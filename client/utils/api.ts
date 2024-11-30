import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.254.106:5000",
});

export default api;
