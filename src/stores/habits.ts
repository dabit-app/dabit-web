import {writable} from "svelte/store";
import type {Habit} from "../models/habit";

export interface IndexedHabit {
  [id: string]: Habit
}

export const habitStore = writable<IndexedHabit | null>(null);