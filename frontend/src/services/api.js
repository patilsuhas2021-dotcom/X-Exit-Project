import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api"
});

export const setToken = (token) => {
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default API;