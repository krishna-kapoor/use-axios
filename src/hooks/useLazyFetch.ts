import { AxiosError } from "axios";
import { useCallback, useReducer } from "react";
import { useAxios } from "../context";
import { AxiosFetchStatus } from "../reducers";
import { AxiosLazyFetchReducer, TAxiosLazyFetchReducer } from "../reducers/use-lazy-fetch-reducer";
import { AxiosFetcher, AxiosFetchInfo, REDUCER_INITIAL_STATE } from "./constants";

export interface UseLazyFetchConfig<P = Record<string, any>> {
    url: string;
    params?: P;
    skip?: boolean;
}

export interface AxiosData<D> {
    error: AxiosError<unknown, D> | undefined;
    data: D | undefined;
}

export type useLazyFetchReturn<D> = [AxiosFetcher<AxiosData<D>>, AxiosFetchInfo];

export function useLazyFetch<D = any, P = any>(options: UseLazyFetchConfig<P>) {
    const { params, url, skip } = options;

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
                ReactAxios.client.get<D>(url, { params: options ?? params });

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
        [params, url, skip]
    );

    return [
        performAxiosAction,
        {
            error: state.error,
            loading: state.status === AxiosFetchStatus.LOADING,
            status: state.status,
        },
    ];
}
