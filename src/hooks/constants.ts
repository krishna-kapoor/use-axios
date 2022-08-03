import { AxiosRequestHeaders } from "axios";
import { AxiosFetchStatus } from "../reducers";
import { AxiosFetchReducerState } from "../reducers/use-fetch-reducer";

export const REDUCER_INITIAL_STATE: AxiosFetchReducerState = {
    data: undefined,
    status: AxiosFetchStatus.IDLE,
    error: undefined,
};

export interface AxiosFetchInfo<D = any> {
    error: AxiosFetchReducerState<D>["error"];
    loading: boolean;
    status: AxiosFetchStatus;
    clearErrors(): void;
}

export type AxiosFetcher<R = void> = <P>(options?: P) => Promise<R>;

export type ParamsType = Record<string, any>;

export interface FetchConfig {
    /**
     * Relative path to the desired endpoint to fetch from.
     */
    url: string;
    /**
     * Additional parameters to be passed to the fetch request.
     */
    params?: ParamsType;
    /**
     * Whether or not to skip fetching.
     */
    skip?: boolean;
    /**
     * Request headers to be passed to the Axios client.
     */
    headers?: AxiosRequestHeaders;
    /**
     * Return retrieved data in another format.
     */
}
