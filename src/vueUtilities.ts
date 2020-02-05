import { ref, watch } from "@vue/composition-api";

export function useLocalStorageRef<T>(key: string, initial: T) {
    const storageJSON = localStorage.getItem(key);

    const out = ref(
        storageJSON !== null ? (JSON.parse(storageJSON) as T) : initial
    );

    watch(
        out,
        newValue => localStorage.setItem(key, JSON.stringify(newValue)),
        { lazy: true, deep: true }
    );

    return out;
}

export function dualbounce<TNew, TOld>(
    fn: (newValue: TNew, oldValue: TOld) => void,
    timeout: number
): (newValue: TNew, oldValue: TOld) => void {
    let initial: TOld;
    let initialSet = false;
    let timeoutId: number | null = null;
    return (newValue, oldValue) => {
        if (!initialSet) {
            initialSet = true;
            initial = oldValue;
        }
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn(newValue, initial);
            initialSet = false;
        }, timeout);
    };
}
