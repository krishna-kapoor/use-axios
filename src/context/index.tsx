import { AxiosInstance, AxiosRequestConfig } from "axios";
import * as React from "react";
import { AxiosCache } from "../cache";
import { useAxiosClient } from "../client";

export interface AxiosContext {
    client: AxiosInstance;
    cache: AxiosCache;
}

export type AxiosProviderProps = React.PropsWithChildren<{
    config: AxiosRequestConfig;
}>;

const AxiosContext = React.createContext<AxiosContext>({} as any);

export const AxiosProvider: React.FC<AxiosProviderProps> = props => {
    const client = useAxiosClient(props.config);

    return (
        <AxiosContext.Provider value={{ cache: new AxiosCache(), client }}>
            {props.children}
        </AxiosContext.Provider>
    );
};

export function useAxios() {
    return React.useContext(AxiosContext);
}
