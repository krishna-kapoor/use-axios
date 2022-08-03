import * as React from "react";

export function useMounted() {
    const mountRef = React.useRef(true);

    React.useEffect(() => {
        mountRef.current = true;

        return () => {
            mountRef.current = false;
        };
    }, []);

    return mountRef.current;
}
