import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import env from './env';

/* ---------------------------------------------------------------------------
 * BHAVITA TEXTILES — central Axios instance.
 *
 * Rules of use (enforced by ESLint `no-restricted-imports`):
 *   - Only files under `src/services/**` may import this module.
 *   - Components, hooks, app routes MUST go through a service function.
 *
 * Features:
 *   - Attaches `Authorization: Bearer <accessToken>` to every request.
 *   - On 401, performs a SINGLE refresh via `POST /auth/refresh`
 *     (refresh token rides in an HttpOnly cookie via `withCredentials`).
 *   - Concurrent 401s queue and replay after the single refresh completes.
 *   - On refresh failure, queue is flushed and access token is cleared.
 * ------------------------------------------------------------------------- */

let accessToken: string | null = null;
let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

function processQueue(token: string | null): void {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

const BASE_URL: string = stripTrailingSlash(env.NEXT_PUBLIC_API_URL);

const baseConfig: AxiosRequestConfig = {
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
};

const api: AxiosInstance = axios.create(baseConfig);

api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  if (accessToken && cfg.headers) {
    cfg.headers.Authorization = `Bearer ${accessToken}`;
  }
  return cfg;
});

type RetryableRequest = AxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalReq = (err.config ?? {}) as RetryableRequest;

    if (err.response?.status !== 401 || originalReq._retry) {
      return Promise.reject(err);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((token) => {
          if (!token) {
            reject(err);
            return;
          }
          if (originalReq.headers) {
            originalReq.headers.Authorization = `Bearer ${token}`;
          }
          resolve(api(originalReq));
        });
      });
    }

    originalReq._retry = true;
    isRefreshing = true;

    try {
      const refreshUrl = `${BASE_URL}/auth/refresh`;
      const r = await axios.post(refreshUrl, null, { withCredentials: true });
      const newToken: string | null = r.data?.data?.accessToken ?? null;
      setAccessToken(newToken);
      processQueue(newToken);
      return api(originalReq);
    } catch (refreshErr) {
      processQueue(null);
      setAccessToken(null);
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
