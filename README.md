# @krishna-kapoor/use-axios

A toolkit to fetch using Axios in ReactJS with built-in caching.

## Usage

Import the `AxiosProvider` component into your `_app.js` (or `app.tsx` for TypeScript) file. And wrap around your component like so:

```js
import { createConfig, AxiosProvider } from "@krishna-kapoor/use-axios";

const AXIOS_CONFIG = createConfig({
    baseURL: "<your-api-endpoint>",
});

export default function App({ Component, pageProps }) {
    return (
        <AxiosProvider config={AXIOS_CONFIG}>
            <Component {...pageProps} />
        </AxiosProvider>
    );
}
```

Now you are ready to use hooks like `useFetch` and `useLazyFetch` within your component tree for data fetching.

## `useFetch`

A hook to fetch data from the provided `url`.

```tsx
export function Component() {
    const [data, { loading, error, status }, fetchDataAgain] = useFetch<YourDataType>({
        url: "<your-url>",
    });

    return (
        <div>
            Display your data here.
            <button onClick={() => fetchDataAgain()}>Fetch again?</button>
        </div>
    );
}
```

## useLazyFetch

A hook to lazy fetch data from the provided `url`

```tsx
export function Component() {
    const [lazyFetch, { data, loading, error, status }] = useLazyFetch<YourDataType>({
        url: "<your-url>",
    });

    return (
        <div>
            Display your data here.
            <button onClick={() => lazyFetch()}>Fetch again?</button>
        </div>
    );
}
```
