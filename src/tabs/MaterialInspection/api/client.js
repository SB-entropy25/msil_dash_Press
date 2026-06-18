import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const TOKEN_KEY = 'mi_token';
const APPEND_TOKEN_KEY = 'mi_append_token';
const PLANT_KEY = 'mi_plant';
const PLANT_INFO_KEY = 'mi_plant_info';

export const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: { 'Content-Type': 'application/json' },
});

const getReadToken = () => sessionStorage.getItem(TOKEN_KEY);
const getAppendToken = () => sessionStorage.getItem(APPEND_TOKEN_KEY);

api.interceptors.request.use((config) => {
    const isAppendRoute = config.url?.startsWith('/append');
    const token = isAppendRoute ? (getAppendToken() || getReadToken()) : getReadToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            clearSession();
            window.dispatchEvent(new CustomEvent('mi-auth-expired'));
        }
        return Promise.reject(error);
    }
);

export const clearSession = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(APPEND_TOKEN_KEY);
    sessionStorage.removeItem(PLANT_KEY);
    sessionStorage.removeItem(PLANT_INFO_KEY);
};

export const saveSession = (loginResponse) => {
    sessionStorage.setItem(TOKEN_KEY, loginResponse.token);
    sessionStorage.setItem(PLANT_KEY, loginResponse.plant);
    sessionStorage.setItem(PLANT_INFO_KEY, JSON.stringify({
        plant: loginResponse.plant,
        display_name: loginResponse.display_name,
        master_file: loginResponse.master_file,
    }));
    sessionStorage.removeItem(APPEND_TOKEN_KEY);
};

export const saveAppendToken = (token) => {
    sessionStorage.setItem(APPEND_TOKEN_KEY, token);
};

export const getStoredPlantInfo = () => {
    try {
        const raw = sessionStorage.getItem(PLANT_INFO_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const isAuthenticated = () => !!getReadToken() && !!sessionStorage.getItem(PLANT_KEY);

export const fetchPlants = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/plants`);
    return res.data.plants;
};

export const loginPlant = async (plant, password) => {
    const res = await api.post('/auth/login', { plant, password });
    saveSession(res.data);
    return res.data;
};

export const verifyAppendPassword = async (password) => {
    const res = await api.post('/auth/verify-append', { password });
    saveAppendToken(res.data.token);
    return res.data;
};

export const fetchOptions = async () => {
    try {
        const response = await api.get('/options');
        return response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
        return { materials: [], suppliers: [] };
    }
};

export const fetchDashboardData = async (filters) => {
    try {
        const response = await api.post('/dashboard', filters);
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return null;
    }
};

export const fetchDailyMonitorData = async (date) => {
    try {
        const response = await api.post('/daily-monitor', { date });
        return response.data;
    } catch (error) {
        console.error("Error fetching daily monitor:", error);
        return null;
    }
};

export const downloadAppendLog = async (filename) => {
    const token = getAppendToken() || getReadToken();
    const res = await fetch(`${API_BASE_URL}/api/append/download-log`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Download failed');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'transaction_log.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
};
