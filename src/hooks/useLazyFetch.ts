import { AxiosError } from "axios";
import { useCallback, useReducer } from "react";
import { useAxios } from "../context";
import { AxiosFetchStatus } from "../reducers";
import { AxiosLazyFetchReducer, TAxiosLazyFetchReducer } from "../reducers/use-lazy-fetch-reducer";
import { AxiosFetcher, AxiosFetchInfo, FetchConfig, REDUCER_INITIAL_STATE } from "./constants";

export interface UseLazyFetchConfig extends FetchConfig {}

export interface AxiosData<D> {
    error: AxiosError<unknown, D> | undefined;
    data: D | undefined;
}

export type UseLazyFetchReturn<D> = [AxiosFetcher<AxiosData<D>>, AxiosFetchInfo & AxiosData<D>];

/**
 * A hook to lazy fetch data from the provided `url`.
 * @param options `UseLazyFetchConfig`
 */
export function useLazyFetch<D = any>(options: UseLazyFetchConfig): UseLazyFetchReturn<D> {
    const { url, skip, ...axiosClientOptions } = options;

    const ReactAxios = useAxios();

    if (!ReactAxios) {
        throw new Error("Please wrap your application with `AxiosProvider`.");
    }

    const [state, dispatch] = useReducer<TAxiosLazyFetchReducer<D>>(
        AxiosLazyFetchReducer,
        REDUCER_INITIAL_STATE
    );

    const performAxiosAction = useCallback<AxiosFetcher<AxiosData<D>>>(
        async options => {
            const axiosFetchFunction = () =>
                ReactAxios.client.get<D>(url, {
                    ...axiosClientOptions,
                    params: options ?? axiosClientOptions.params,
                });

            if (skip) return { data: undefined, error: undefined };

            try {
                const { data } = await axiosFetchFunction();

                dispatch({ type: "FETCHED", payload: data });
            } catch (error) {
                dispatch({ type: "ERROR", payload: error as AxiosError });
            }

            return {
                error: state.error,
                data: state.data,
            };
        },
        [axiosClientOptions, url, skip]
    );

    return [
        performAxiosAction,
        {
            ...state,
            loading: state.status === AxiosFetchStatus.LOADING,
        },
    ];
}
