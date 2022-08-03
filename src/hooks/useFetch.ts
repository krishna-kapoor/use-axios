import { AxiosError } from "axios";
import { useCallback, useEffect, useReducer } from "react";
import { useAxios } from "../context";
import { AxiosFetchStatus } from "../reducers";
import { AxiosFetchReducer, TAxiosFetchReducer } from "../reducers/use-fetch-reducer";
import { AxiosFetcher, AxiosFetchInfo, REDUCER_INITIAL_STATE } from "./constants";
import { useMounted } from "./useMounted";

export type AxiosFetchPolicy = "cache-only" | "cache-and-network" | "network-only";
export interface UseFetchConfig<P = Record<string, any>> {
    url: string;
    fetchPolicy?: AxiosFetchPolicy;
    params?: P;
    skip?: boolean;
}

export type UseFetchReturn<D = any> = [D | undefined, AxiosFetchInfo<D>, AxiosFetcher];

/**
 * A hook to fetch data from the provided `url`.
 * @param options `UseFetchOptions`
 */
export function useFetch<D = any, P = Record<string, any>>(
    options: UseFetchConfig<P>
): UseFetchReturn<D> {
    const { params, url, fetchPolicy = "cache-and-network", skip } = options;

    const ReactAxios = useAxios();

    if (!ReactAxios) {
        throw new Error("Please wrap your application with `AxiosProvider`.");
    }

    const mounted = useMounted();

    const [state, dispatch] = useReducer<TAxiosFetchReducer<D>>(
        AxiosFetchReducer(ReactAxios.cache, options),
        REDUCER_INITIAL_STATE
    );

    const okToFetch = mounted && !skip;

    const performAxiosAction = useCallback<AxiosFetcher<void>>(
        async options => {
            const axiosFetchFunction = () =>
                ReactAxios.client.get<D>(url, { params: options ?? params });

            try {
                switch (fetchPolicy) {
                    case "network-only":
                        dispatch({ type: "FETCHING" });

                        const res_1 = await axiosFetchFunction();

                        return dispatch({ type: "NETWORK-ONLY-FETCHED", payload: res_1.data });

                    case "cache-only":
                        return dispatch({ type: "CACHE-ONLY-FETCHED" });

                    case "cache-and-network":
                        if (ReactAxios.cache.exists(url)) {
                            return dispatch({ type: "CACHE-ONLY-FETCHED" });
                        }

                        dispatch({ type: "FETCHING" });

                        const res_2 = await axiosFetchFunction();

                        return dispatch({ type: "CACHE-AND-NETWORK-FETCHED", payload: res_2.data });
                }
            } catch (error) {
                dispatch({ type: "ERROR", payload: error as AxiosError });
            }
        },
        [params, url, fetchPolicy]
    );

    useEffect(() => {
        if (okToFetch) {
            performAxiosAction(params);
        }
    }, [okToFetch, params]);

    return [
        state.data,
        {
            error: state.error,
            loading: state.status === AxiosFetchStatus.LOADING,
            status: state.status,
        },
        performAxiosAction,
    ];
}
