import {get, writable} from "svelte/store";
import type {Habit} from "../models/habit";
import {toggleDayCompletion} from "../lib/api/dabit-api";
import type {DailyHabitData} from "../lib/habit/daily";

export const habitStore = writable<Habit[] | null>(null);

export async function markCompletion(item: DailyHabitData, completed: boolean) {
  if (await toggleDayCompletion(item.habit, item.day, completed)) {
    let habits = get(habitStore)
    let storedHabit = habits.find(habit => habit.id === item.habit.id);

    if (completed) {
      storedHabit.completions.push(item.event.index)
    } else {
      const index = storedHabit.completions.indexOf(item.event.index);
      if (index > -1) {
        storedHabit.completions.splice(index, 1);
      }
    }

    habitStore.set(habits);
  }
}
