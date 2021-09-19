import {createWritableStore} from '../lib/store/persistent-store';

export const jwt = createWritableStore<string | null>("jwt", null);