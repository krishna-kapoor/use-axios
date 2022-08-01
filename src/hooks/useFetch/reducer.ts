import { AxiosError } from "axios";
import { AxiosFetchStatus, UseFetchConfig } from ".";
import { AxiosCache } from "../../cache";

export type Action<T, P> = { type: T; payload: P };
export type ActionWithoutPayload<T> = { type: T };

export type ReducerActions<D = any> =
    | ActionWithoutPayload<"FETCHING">
    | ActionWithoutPayload<"CACHE-ONLY-FETCHED">
    | Action<"CACHE-AND-NETWORK-FETCHED", D>
    | Action<"NETWORK-ONLY-FETCHED", D>
    | Action<"ERROR", AxiosError<unknown, D>>;

export type Reducer<D = any> = (
    state: ReducerState<D>,
    action: ReducerActions<D>
) => ReducerState<D>;

export interface ReducerState<D = any> {
    data: D | undefined;
    status: AxiosFetchStatus;
    error: AxiosError<unknown, D> | undefined;
}

export function AxiosFetchReducer(cache: AxiosCache, options: UseFetchConfig) {
    return <D>(state: ReducerState<D>, action: ReducerActions<D>) => {
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
                throw new Error("[AXIOS REDUCER] Unknown action type: " + (action as any).type);
        }
    };
}
