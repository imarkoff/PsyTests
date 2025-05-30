import {useEffect, useState} from "react";

/**
 * Custom hook to debounce a callback function.
 * @param callback - The callback function to debounce.
 * @param delay - The debounce delay in milliseconds.
 * @return The debounced callback function.
 * @template T - The type of the callback function.
 *
 * @example
 * ```typescript
 * import useDebounce from './useDebounce';
 *
 * const useFetchData = () => {
 *    const [query, setQuery] = useState('');
 *    const debouncedQuery = useDebounce(query, 300);
 *
 *    useEffect(() => {
 *       if (debouncedQuery.length > 0) {
 *          fetchData(debouncedQuery);
 *       }
 *    }, [debouncedQuery]);
 *
 *    return { query, setQuery };
 * };
 * ```
 */
export default function useDebounce<T>(
    callback: T,
    delay: number
) {
    const [debouncedCallback, setDebouncedCallback] = useState<T>(callback);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedCallback(callback);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [callback, delay]);

    return debouncedCallback;
}