import { AxiosError } from "axios";
import { useCallback, useEffect, useReducer } from "react";
import { useAxios } from "../context";
import { AxiosFetchStatus } from "../reducers";
import { AxiosFetchReducer, TAxiosFetchReducer } from "../reducers/use-fetch-reducer";
import { AxiosFetcher, AxiosFetchInfo, FetchConfig, REDUCER_INITIAL_STATE } from "./constants";
import { useMounted } from "./useMounted";

export type AxiosFetchPolicy = "cache-only" | "cache-and-network" | "network-only";

export interface UseFetchConfig extends FetchConfig {
    /**
     * Choose how you would like to fetch data: (1) cache-only, (2) network-only, (3) cache-and-network [default]
     */
    fetchPolicy?: AxiosFetchPolicy;
    /**
     * How often you would like to fetch data.
     */
    pollInterval?: number;
}

export type UseFetchReturn<D = any> = [D | undefined, AxiosFetchInfo<D>, AxiosFetcher];

/**
 * A hook to fetch data from the provided `url`..
 * @param options `UseFetchOptions`
 */
export function useFetch<D = any>(options: UseFetchConfig): UseFetchReturn<D> {
    const {
        url,
        fetchPolicy = "cache-and-network",
        skip,
        pollInterval = 0,
        ...axiosClientOptions
    } = options;

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
    const shouldPoll = pollInterval > 0 && okToFetch;

    const clearErrors = useCallback(() => dispatch({ type: "CLEAR-ERRORS" }), []);

    const performAxiosAction = useCallback<AxiosFetcher>(
        async options => {
            const axiosFetchFunction = () =>
                ReactAxios.client.get<D>(url, {
                    ...axiosClientOptions,
                    params: options ?? axiosClientOptions.params,
                });

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
        [axiosClientOptions, url, fetchPolicy]
    );

    useEffect(() => {
        if (okToFetch) {
            performAxiosAction(axiosClientOptions.params);
        }
    }, [okToFetch, axiosClientOptions.params]);

    useEffect(() => {
        if (!shouldPoll) return;

        const pollingInterval = setInterval(() => {
            performAxiosAction(axiosClientOptions.params);
        }, pollInterval);

        return () => {
            clearInterval(pollingInterval);
        };
    }, [shouldPoll]);

    return [
        state.data,
        {
            error: state.error,
            loading: state.status === AxiosFetchStatus.LOADING,
            status: state.status,
            clearErrors,
        },
        performAxiosAction,
    ];
}
