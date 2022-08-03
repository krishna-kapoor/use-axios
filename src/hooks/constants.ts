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
    url: string;
    params?: ParamsType;
    skip?: boolean;
    headers?: AxiosRequestHeaders;
}
