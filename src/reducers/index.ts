import { AxiosError } from "axios";

export type Action<T, P> = { type: T; payload: P };
export type ActionWithoutPayload<T> = { type: T };

export type ErrorAction<D> = Action<"ERROR", AxiosError<unknown, D>>;
export type FetchingAction = ActionWithoutPayload<"FETCHING">;
export type ClearErrorsAction = ActionWithoutPayload<"CLEAR-ERRORS">;

export interface ReducerState<D = any> {
    data: D | undefined;
    status: AxiosFetchStatus;
    error: AxiosError<unknown, D> | undefined;
}

export enum AxiosFetchStatus {
    IDLE,
    LOADING,
    ERROR,
}
