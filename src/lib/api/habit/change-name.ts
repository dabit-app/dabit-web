import type {Habit} from "../../../models/habit";
import type {EmptyResponse} from "../helper/fetch-helper";
import {get} from "svelte/store";
import {habitStore} from "../../../stores/habits";
import {fetchApi} from "../helper/fetch-helper";
import {jwt} from "../../../stores/auth";

export async function changeName(habit: Habit, name: string) {
  if (await changeNameApiCall(habit, name)) {
    let habits = get(habitStore);
    habits[habit.id].name = name;
    habitStore.set(habits);
  }
}

async function changeNameApiCall(habit: Habit, name: string): Promise<boolean> {
  return await fetchApi<EmptyResponse>(
    `habit/${habit.id}/name`,
    'PATCH',
    {name},
    get(jwt)
  )
    .then(result => result.ok)
    .catch(_ => false)
}
