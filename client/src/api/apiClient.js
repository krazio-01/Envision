import axios from 'axios';
import useUserStore from '../store/store';

const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_APP_SERVER_URL}api`,
    withCredentials: true,
});

// call interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            useUserStore.getState().clearUser();
        }
        return Promise.reject(error);
    },
);

export default apiClient;
