import { AxiosInstance, AxiosRequestConfig } from "axios";
import * as React from "react";
import { AxiosCache } from "../cache";
import { initializeAxiosInstance, useAxiosClient } from "../client";

export interface AxiosContext {
    client: AxiosInstance;
    cache: AxiosCache;
}

export type AxiosProviderProps = React.PropsWithChildren<{
    config: AxiosRequestConfig;
}>;

const AxiosContext = React.createContext<AxiosContext>({
    cache: new AxiosCache(),
    client: initializeAxiosInstance({}),
});

export const AxiosProvider: React.FC<AxiosProviderProps> = props => {
    const client = useAxiosClient(props.config);
    const cache = React.useRef(new AxiosCache());

    return (
        <AxiosContext.Provider value={{ cache: cache.current, client }}>
            {props.children}
        </AxiosContext.Provider>
    );
};

export function useAxios() {
    return React.useContext(AxiosContext);
}
