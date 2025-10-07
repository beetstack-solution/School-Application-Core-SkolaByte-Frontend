// axiosInstance.ts
import { getAdminBearerToken } from '@/helpers/tokenHelper';
import axios from 'axios';
import { toast } from 'react-toastify';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
// const schoolKey = import.meta.env.VITE_API_SCHOOL_KEY;


const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Request Interceptor

api.interceptors.request.use(
    (config) => {
        const token = getAdminBearerToken();
           const schoolKey = localStorage.getItem('x-school-apikey');
           console.log("schoolKey", schoolKey);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        config.headers['x-api-key'] = apikey;
        config.headers['x-app-version'] = appVersion;
         if (schoolKey) {
            config.headers['x-school-apikey'] = schoolKey;
        }


        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor for Token Expiry Handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("Error from fetching", error);
        toast.error(error?.response?.data?.message)
        if (error?.status === 401) {
            localStorage.removeItem("user");
            toast.error("token Expired")
            location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export default api;
