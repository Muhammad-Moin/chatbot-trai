import axios from 'axios';
import APIConstants from './APIConstants';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './TokenService';

// Create an Axios instance
const NetworkRequest = axios.create({
  baseURL: APIConstants.baseUrl,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

// Function to redirect to login
const redirectToLogin = () => {
  window.location.href = 'admin/auth';
};

// Function to handle token refresh
const refreshTokenAndRetry = async (originalRequest) => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    console.error('Refresh token not available');
    clearTokens();
    redirectToLogin();
    return Promise.reject(new Error('Refresh token not available'));
  }

  try {
    const response = await axios.post(`${APIConstants.baseUrl}token/refresh/`, { refresh: refreshToken });
    const { access } = response.data;
    setTokens(access, refreshToken);
    originalRequest.headers['Authorization'] = `Bearer ${access}`;
    return NetworkRequest(originalRequest);
  } catch (err) {
    console.error('Token refresh failed', err);
    clearTokens();
    redirectToLogin();
    return Promise.reject(err);
  }
};

// Request interceptor to add the access token to headers
NetworkRequest.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refreshing
NetworkRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return refreshTokenAndRetry(originalRequest);
    }

    console.error('Response error', error);
    return Promise.reject(error);
  }
);

export default NetworkRequest;
