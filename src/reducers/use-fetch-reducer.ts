import { AxiosError } from "axios";
import { Reducer } from "react";
import { Action, ActionWithoutPayload, AxiosFetchStatus, ErrorAction, FetchingAction } from ".";
import { AxiosCache } from "../../cache";
import { UseFetchConfig } from "../hooks/useFetch";

type ReducerActions<D = any> =
    | FetchingAction
    | ActionWithoutPayload<"CACHE-ONLY-FETCHED">
    | Action<"CACHE-AND-NETWORK-FETCHED", D>
    | Action<"NETWORK-ONLY-FETCHED", D>
    | ErrorAction<D>;

export interface AxiosFetchReducerState<D = any> {
    data: D | undefined;
    status: AxiosFetchStatus;
    error: AxiosError<unknown, D> | undefined;
}

export type TAxiosFetchReducer<D = any> = Reducer<AxiosFetchReducerState<D>, ReducerActions<D>>;

export function AxiosFetchReducer(cache: AxiosCache, options: UseFetchConfig) {
    return <D>(state: AxiosFetchReducerState<D>, action: ReducerActions<D>) => {
        switch (action.type) {
            case "FETCHING":
                return {
                    ...state,
                    status: AxiosFetchStatus.LOADING,
                };

            case "CACHE-ONLY-FETCHED":
                return {
                    ...state,
                    data: cache.retrieve(options.url),
                    status: AxiosFetchStatus.IDLE,
                };

            case "CACHE-AND-NETWORK-FETCHED":
                let data;

                if (cache.exists(options.url)) {
                    data = cache.retrieve(options.url);
                } else {
                    data = action.payload;
                }

                cache.save(options.url, data);

                return {
                    ...state,
                    data,
                    status: AxiosFetchStatus.IDLE,
                };

            case "NETWORK-ONLY-FETCHED":
                return {
                    ...state,
                    data: action.payload,
                    status: AxiosFetchStatus.IDLE,
                };

            case "ERROR":
                return {
                    ...state,
                    error: action.payload,
                    status: AxiosFetchStatus.ERROR,
                };

            default:
                throw new Error("[useFetch] Unknown action type: " + (action as any).type);
        }
    };
}
