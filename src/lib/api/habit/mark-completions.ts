import type {Habit} from "../../../models/habit";
import type {DailyHabitData} from "../../habit/daily";
import type {EmptyResponse} from "../helper/fetch-helper";
import type {DateOnly} from "../../date/date-only";
import {jwt} from "../../../stores/auth";
import {toString} from "../../date/date-only";
import {fetchApi} from "../helper/fetch-helper";
import {get} from "svelte/store";
import {habitStore} from "../../../stores/habits";

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

async function toggleDayCompletion(habit: Habit, day: DateOnly, completed: boolean): Promise<boolean> {
  return await fetchApi<EmptyResponse>(
    `habit/${habit.id}/completed`,
    completed ? 'POST' : 'DELETE',
    {day: toString(day)},
    get(jwt)
  )
    .then(result => result.ok)
    .catch(_ => false)
}