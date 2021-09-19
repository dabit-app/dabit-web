import {createWritableStore} from '../lib/store/persistent-store';

let defaultDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

export const darkMode = createWritableStore<boolean>("dark-mode", defaultDarkMode);
