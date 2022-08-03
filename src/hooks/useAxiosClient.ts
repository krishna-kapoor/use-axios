import { AxiosRequestConfig } from "axios";
import { useMemo } from "react";
import { initializeAxiosInstance } from "../client";

export function useAxiosClient(config: AxiosRequestConfig) {
    return useMemo(() => initializeAxiosInstance(config), [config]);
}
