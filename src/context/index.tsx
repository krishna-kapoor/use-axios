import { AxiosInstance, AxiosRequestConfig } from "axios";
import { createContext, useContext, useMemo, useRef } from "react";
import { AxiosCache } from "../cache";
import { initializeAxiosInstance } from "../client";

export interface AxiosContext {
    client: AxiosInstance;
    cache: AxiosCache;
}

export type AxiosProviderProps = React.PropsWithChildren<{
    config: AxiosRequestConfig;
}>;

const AxiosContext = createContext<AxiosContext>({
    cache: new AxiosCache(),
    client: initializeAxiosInstance({}),
});

function useAxiosCache() {
    const cacheRef = useRef(new AxiosCache());

    return cacheRef.current;
}

function useAxiosClient(config: AxiosRequestConfig) {
    return useMemo(() => initializeAxiosInstance(config), [config]);
}

export const AxiosProvider: React.FC<AxiosProviderProps> = props => {
    const client = useAxiosClient(props.config);
    const cache = useAxiosCache();

    return (
        <AxiosContext.Provider value={{ cache, client }}>{props.children}</AxiosContext.Provider>
    );
};

export function useAxios() {
    return useContext(AxiosContext);
}
