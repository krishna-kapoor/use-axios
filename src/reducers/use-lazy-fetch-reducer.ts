import { Reducer } from "react";
import { Action, AxiosFetchStatus, ErrorAction, FetchingAction, ReducerState } from ".";

type ReducerActions<D> = Action<"FETCHED", D> | FetchingAction | ErrorAction<D>;

export type TAxiosLazyFetchReducer<D = any> = Reducer<ReducerState<D>, ReducerActions<D>>;

export function AxiosLazyFetchReducer<D = any>(
    state: ReducerState<D>,
    action: ReducerActions<D>
): ReducerState<D> {
    switch (action.type) {
        case "FETCHED":
            return { ...state, data: action.payload, status: AxiosFetchStatus.IDLE };
        case "FETCHING":
            return { ...state, status: AxiosFetchStatus.LOADING };
        case "ERROR":
            return { ...state, status: AxiosFetchStatus.ERROR };
        default:
            throw new Error("[useLazyFetch] Unknown action type: " + (action as any).type);
    }
}
