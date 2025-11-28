import axios from "axios";

// const baseURL=import.meta.env.VITE_API_BASEURL
const baseURL="http://localhost:8000"
console.log(baseURL)
export const api = axios.create({
  baseURL: `${baseURL}/user`, // change to your backend URL
  withCredentials: true, // if you are using cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access-token"); // or sessionStorage/cookie
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default api;