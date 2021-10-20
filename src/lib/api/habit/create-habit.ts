import {fetchApi} from "../helper/fetch-helper";
import {get} from "svelte/store";
import {habitStore} from "../../../stores/habits";
import {jwt} from "../../../stores/auth";
import {Err, Ok, Result} from "ts-results";
import type {Habit} from "../../../models/habit";

export async function createHabit(name: string): Promise<Result<Habit, void>> {
  const response = await createHabitApiCall(name);

  if (response.ok) {
    let habits = get(habitStore);
    habits[response.val.id] = response.val;
    habitStore.set(habits);
  }

  return response;
}

async function createHabitApiCall(name: string): Promise<Result<Habit, void>> {
  return await fetchApi<Habit>(
    `habit`,
    'POST',
    {name},
    get(jwt)
  )
    .then(result => {
      if (result.ok) {
        return Ok(result.val)
      } else {
        return Err.EMPTY
      }
    })
    .catch(_ => Err.EMPTY)
}
