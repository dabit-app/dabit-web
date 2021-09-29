import type {Habit, TimeSpan} from "../../../models/habit";
import type {DaysOfWeek} from "../../date/day-of-week";
import type {Result} from "ts-results";
import {Err, Ok} from "ts-results";
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

export async function getHabit(id: string): Promise<Result<Habit, void>> {
  return await fetchApi<HabitResponse>(`habit/${id}`, 'GET', undefined, get(jwt))
    .then(result => {
      if (result.ok) {
        return Ok(convertDateFromHabit(result.val))
      } else {
        return Err.EMPTY;
      }
    });
}

export async function getAllHabits(page: number = 1): Promise<Result<Paginated<Habit>, void>> {
  return await fetchApi<Paginated<HabitResponse>>(
    `habit/?page=${page}`,
    'GET',
    undefined,
    get(jwt)
  )
    .then(paginated => {
      if (paginated.ok) {
        let page = paginated.val as unknown as Paginated<Habit>;
        page.items = paginated.val.items.map(convertDateFromHabit);
        return Ok(page as Paginated<Habit>);
      } else {
        return Err.EMPTY;
      }
    });
}

function convertDateFromHabit(habitResponse: HabitResponse): Habit {
  let habit = {...habitResponse} as unknown as Habit;

  if (!!habitResponse.schedule) {
    habit.schedule.startDate = fromString(habitResponse.schedule.startDate);
    habit.schedule.endDate = habitResponse.schedule.endDate === null ? null : fromString(habitResponse.schedule.endDate);
  }

  return habit;
}

interface HabitResponse {
  id: string;
  name: string;
  schedule: ScheduleResponse;
  completions: number[];
}

interface ScheduleResponse {
  cadency: TimeSpan;
  duration: TimeSpan;
  daysOfWeek: DaysOfWeek | null;
  endDate: string | null;
  startDate: string;
}
