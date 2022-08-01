import { Method } from "axios";
import { useCallback, useEffect, useReducer } from "react";
import { useAxios } from "../../context";
import { useMounted } from "../useMounted";
import { AxiosFetchReducer, Reducer, ReducerState } from "./reducer";

export enum AxiosFetchStatus {
    IDLE,
    LOADING,
    ERROR,
}

export type AxiosFetchPolicy = "cache-only" | "cache-and-network" | "network-only";

export interface UseFetchConfig {
    url: string;
    fetchPolicy?: AxiosFetchPolicy;
    params: Record<string, any>;
    method?: Method;
    lazy?: boolean;
}

export type UseFetchReturn<D = any> = [
    D | undefined,
    {
        error: ReducerState["error"];
        loading: boolean;
    },
    <P>(options: P) => void
];

const REDUCER_INITIAL_STATE: ReducerState = {
    data: undefined,
    status: AxiosFetchStatus.IDLE,
    error: undefined,
};

export function useFetch<D = any>(options: UseFetchConfig): UseFetchReturn<D> {
    const { params, url, fetchPolicy = "cache-and-network", method = "get", lazy } = options;

    const { cache, client } = useAxios();

    const mounted = useMounted();

    const [state, dispatch] = useReducer<Reducer<D>>(
        AxiosFetchReducer(cache, options),
        REDUCER_INITIAL_STATE
    );

    const okToFetch = mounted || !lazy;

    const performAxiosAction = useCallback(
        async <P>(options?: P) => {
            const axiosFetchFunction = () =>
                client({
                    url,
                    method,
                    params: options ?? params,
                });

            switch (fetchPolicy) {
                case "network-only":
                    const res_1 = await axiosFetchFunction();

                    return dispatch({ type: "NETWORK-ONLY-FETCHED", payload: res_1.data });

                case "cache-only":
                    return dispatch({ type: "CACHE-ONLY-FETCHED" });

                case "cache-and-network":
                    if (cache.exists(url)) {
                        return dispatch({ type: "CACHE-ONLY-FETCHED" });
                    }

                    const res_2 = await axiosFetchFunction();

                    return dispatch({ type: "CACHE-AND-NETWORK-FETCHED", payload: res_2.data });
            }
        },
        [params, url, fetchPolicy, method]
    );

    useEffect(() => {
        if (okToFetch) {
            performAxiosAction(options.params);
        }
    }, [okToFetch, params]);

    return [
        state.data,
        {
            error: state.error,
            loading: state.status === AxiosFetchStatus.LOADING,
        },
        performAxiosAction,
    ];
}
