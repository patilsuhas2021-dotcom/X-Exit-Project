import axios from "axios";

const API = axios.create({
  baseURL: window.location.hostname === "localhost" 
    ? "http://localhost:3001/api" 
    : "https://x-exit-project.onrender.com/api"
});

export const setToken = (token) => {
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default API;