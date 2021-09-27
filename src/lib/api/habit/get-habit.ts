import type {Habit} from "../../../models/habit";
import {fetchApi} from "../helper/fetch-helper";
import {get} from "svelte/store";
import {jwt} from "../../../stores/auth";
import {fromString} from "../../date/date-only";

interface Paginated<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

export async function getHabit(id: string): Promise<Habit> {
  return await fetchApi<Habit>(`habit/${id}`, 'GET', undefined, get(jwt))
    .then(convertDateFromHabit);
}

export async function getAllHabits(page: number = 1): Promise<Paginated<Habit>> {
  return await fetchApi<Paginated<Habit>>(
    `habit/?page=${page}`,
    'GET',
    undefined,
    get(jwt)
  )
    .then(paginated => {
      paginated.items = paginated.items.map(convertDateFromHabit);
      return paginated;
    });
}

function convertDateFromHabit(habit: any): Habit {
  if (!!habit.schedule) {
    habit.schedule.startDate = fromString(habit.schedule.startDate);
    habit.schedule.endDate = habit.schedule.endDate === null ? null : fromString(habit.schedule.endDate);
  }

  return habit;
}