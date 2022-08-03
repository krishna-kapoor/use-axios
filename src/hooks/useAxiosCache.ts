import { useRef } from "react";
import { AxiosCache } from "../cache";

export function useAxiosCache() {
    const cacheRef = useRef(new AxiosCache());

    return cacheRef.current;
}
