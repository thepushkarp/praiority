import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { toast } from 'react-toastify';

import { authURL, baseURL, utilURL } from '../constants';

const apiURL = baseURL;
const authenticationURL = authURL;

/**
 * Client to make API Requests
 *
 * @param {String} url API Endpoint
 * @returns {Promise<AxiosResponse<T>>} Axios Response
 */
export const client = (url, { baseURL = 'base', ...options } = {}) => {
  const endpoint = getURL(url, baseURL);

  let requestOptions = { ...options };
  requestOptions.headers = {
    'ngrok-skip-browser-warning': 'any',
  };
  if (baseURL !== 'auth')
    requestOptions.headers['Authorization'] = `Bearer ${localStorage.getItem(
      'token'
    )}`;

  axios.interceptors.response.use(
    (config) => config,
    (error) => {
      if (error?.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
        toast.error(error.response.data.message);
      } else {
        return Promise.reject(error);
      }
    }
  );

  const instance = axios({ url: endpoint, ...requestOptions });

  return instance;
};

const getURL = (endpoint, baseURL) => {
  if (endpoint.startsWith('/')) {
    if (baseURL === 'base') {
      return `${apiURL}${endpoint}`;
    }

    if (baseURL === 'auth') {
      return `${authenticationURL}${endpoint}`;
    }

    if (baseURL === 'util') {
      return `${utilURL}${endpoint}`;
    }
  }

  return endpoint;
};
