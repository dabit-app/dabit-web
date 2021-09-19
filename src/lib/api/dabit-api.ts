import type {Habit} from "../../models/habit";
import type {DateOnly} from '../date/date-only';
import type {EmptyResponse} from "./fetch-helper";
import {fetchApi} from "./fetch-helper";
import {jwt} from "../../stores/auth";
import {get} from "svelte/store";
import {fromString, toString} from "../date/date-only";

interface Paginated<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

export async function loginWithGoogle(token: string): Promise<string> {
  return await fetchApi<{ token: string }>(
    "auth/google/login",
    "POST",
    {token}
  )
    .then(data => data.token);
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

export async function toggleDayCompletion(habit: Habit, day: DateOnly, completed: boolean): Promise<boolean> {
  return await fetchApi<EmptyResponse>(
    `habit/${habit.id}/completed`,
    completed ? 'POST' : 'DELETE',
    {day: toString(day)},
    get(jwt)
  )
    .then(_ => true)
    .catch(_ => false)
}

function convertDateFromHabit(habit: any): Habit {
  habit.schedule.startDate = fromString(habit.schedule.startDate);
  habit.schedule.endDate = habit.schedule.endDate === null ? null : fromString(habit.schedule.endDate);
  return habit;
}