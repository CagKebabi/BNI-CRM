import axios from 'axios';
import { API_BASE_URL } from './config';

// Axios instance oluşturma
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// İstek interceptor'ı
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Yanıt interceptor'ı
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Eğer hata 401 (Unauthorized) ise ve bu ilk denememiz ise
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Eğer zaten refresh işlemi yapılıyorsa, kuyruğa ekle
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refresh');
                if (!refreshToken) {
                    throw new Error('Refresh token bulunamadı');
                }

                // Refresh token ile yeni access token alma
                const response = await axios.post(`${API_BASE_URL}/users/refresh/`, {
                    refresh: refreshToken
                });

                const { access } = response.data;
                localStorage.setItem('access', access);

                // Kuyruktaki istekleri işle
                processQueue(null, access);

                // Orijinal isteği yeni token ile tekrar dene
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                // Refresh token da geçersizse veya başka bir hata olduysa
                processQueue(refreshError, null);
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                window.location.href = '/login'; // Login sayfasına yönlendir
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
