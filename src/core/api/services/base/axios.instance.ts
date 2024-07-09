import { Config } from "./config";
import { Error } from "@/types";

import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";
import Router from "next/router";

const appConfig = Config.getInstance();

const getAuth = (): string | undefined => {
  const token = Cookies.get("auth");
  return `Bearer ${token}`;
};

const setAuth = (response: AxiosResponse) => {
  if (
    response.data?.accessToken &&
    typeof response.data.accessToken === "string"
  ) {
    const token: string = response.data.accessToken;
    Cookies.set("auth", token);
  }
};

const baseHeaders = (): any => {
  return {
    Accept: "application/json",
    Authorization: getAuth(),
  };
};

const onRequest = (config: InternalAxiosRequestConfig) => {
  const headers = config.headers || {};
  config.headers = {
    "Content-Type": "application/json",
    ...headers,
    ...baseHeaders(),
  };
  return config;
};

const onResponse = (response: AxiosResponse) => {
  const { status, statusText, data } = response;

  if ([200, 201].includes(status)) {
    setAuth(response);
    return response;
  }

  const customError: Error = {
    status: status || data.statusCode,
    message: data.message || statusText,
  };

  if (customError.message === "Unauthorized") {
    Cookies.remove("auth");
    Router.push("/auth/login");
  }

  throw customError;
};

const onResponseError = (error: AxiosError) => {
  return Promise.reject(error);
};

const axiosConfig: AxiosRequestConfig = {
  baseURL: appConfig.apiBaseURL,
  timeout: appConfig.apiReqTimeout,
  headers: baseHeaders(),
  validateStatus: function () {
    return true;
  },
};

const axiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.request.use(onRequest);

axiosInstance.interceptors.response.use(onResponse, onResponseError);

export { axiosInstance as axiosClient, axiosConfig };
