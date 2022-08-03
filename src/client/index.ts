import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { useMemo } from "react";

export * from "./createConfig";

let GLOBAL_AXIOS_CLIENT: AxiosInstance;

function createAxiosInstance(config: AxiosRequestConfig) {
    return axios.create(config);
}

export function initializeAxiosInstance(config: AxiosRequestConfig) {
    return GLOBAL_AXIOS_CLIENT ?? createAxiosInstance(config);
}

export function useAxiosClient(config: AxiosRequestConfig) {
    return useMemo(() => initializeAxiosInstance(config), [config]);
}
