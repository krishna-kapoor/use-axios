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
}

export type AxiosFetcher<R = void> = <P>(options?: P) => Promise<R>;
