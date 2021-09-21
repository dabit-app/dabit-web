import type {DailyHabitData} from "../habit/daily";
import {changeName as apiChangeName, toggleDayCompletion} from "./dabit-api";
import {get} from "svelte/store";
import {habitStore} from "../../stores/habits";
import type {Habit} from "../../models/habit";

/** Add or remove an entry in the completion array for a given habit */
export async function markCompletion(item: DailyHabitData, completed: boolean) {
  if (await toggleDayCompletion(item.habit, item.day, completed)) {
    let habits = get(habitStore)
    let storedHabit = habits[item.habit.id];

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


export async function changeName(habit: Habit, name: string) {
  if (await apiChangeName(habit, name)) {
    let habits = get(habitStore);
    habits[habit.id].name = name;
    habitStore.set(habits);
  }
}