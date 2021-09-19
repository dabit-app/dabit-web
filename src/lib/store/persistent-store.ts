import {writable} from "svelte/store";

export const createWritableStore = <T>(key, startValue) => {
  const { subscribe, set } = writable<T>(startValue);

  return {
    subscribe,
    set,
    useLocalStorage: () => {
      const json = localStorage.getItem(key);
      if (json) {
        set(JSON.parse(json));
      }

      subscribe(current => {
        localStorage.setItem(key, JSON.stringify(current));
      });
    }
  };
}