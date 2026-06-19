import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import env from './env';

let accessToken: string | null = null;
let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function setAccessToken(token: string | null) {
	accessToken = token;
}

function processQueue(token: string | null) {
	refreshQueue.forEach((cb) => cb(token));
	refreshQueue = [];
}

const api: AxiosInstance = axios.create({
	baseURL: env.NEXT_PUBLIC_API_URL.replace(/\/\/$/, ''),
	withCredentials: true, // refresh token cookie
	headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
	if (accessToken && cfg.headers) cfg.headers.Authorization = `Bearer ${accessToken}`;
	return cfg;
});

api.interceptors.response.use(
	(res) => res,
	async (err: AxiosError<any>) => {
		const originalReq = err.config as AxiosRequestConfig & { _retry?: boolean };
		if (err.response?.status === 401 && !originalReq._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					refreshQueue.push((token) => {
						if (!token) return reject(err);
						if (originalReq.headers) originalReq.headers.Authorization = `Bearer ${token}`;
						resolve(api(originalReq));
					});
				});
			}

			originalReq._retry = true;
			isRefreshing = true;
			try {
				const r = await axios.post(`${env.NEXT_PUBLIC_API_URL.replace(/\/\/$/, '')}/auth/refresh`, null, {
					withCredentials: true,
				});
				const newToken = r.data?.data?.accessToken;
				setAccessToken(newToken ?? null);
				processQueue(newToken ?? null);
				return api(originalReq);
			} catch (refreshErr) {
				processQueue(null);
				setAccessToken(null);
				return Promise.reject(refreshErr);
			} finally {
				isRefreshing = false;
			}
		}
		return Promise.reject(err);
	}
);

export default api;
export { setAccessToken };
