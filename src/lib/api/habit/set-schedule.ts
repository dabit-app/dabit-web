import type {Habit, Schedule, TimeSpan} from "../../../models/habit";
import type {ApiError, ApiErrorForm} from "../common/ApiError";
import type {Result} from "ts-results";
import type {DaysOfWeek} from "../../date/day-of-week";
import {fetchApi} from "../helper/fetch-helper";
import {get} from "svelte/store";
import {habitStore} from "../../../stores/habits";
import {jwt} from "../../../stores/auth";
import {toString} from "../../date/date-only";

export async function setSchedule(habit: Habit, schedule: Schedule): Promise<Result<void, ApiError | ApiErrorForm>> {
  let result = await setScheduleApi(habit, schedule);

  if (result.ok) {
    let habits = get(habitStore)
    let storedHabit = habits[habit.id];
    storedHabit.schedule = schedule;
    habitStore.set(habits);
  }

  return result;
}

async function setScheduleApi(habit: Habit, schedule: Schedule): Promise<Result<void, ApiError | ApiErrorForm>> {
  return await fetchApi<void, ApiError | ApiErrorForm>(
    `habit/${habit.id}/schedule`,
    'PATCH',
    {schedule: toScheduleRequest(schedule)},
    get(jwt)
  )
}

function toScheduleRequest(schedule: Schedule): ScheduleRequest {
  let request = {...schedule} as unknown as ScheduleRequest;
  request.endDate = schedule.endDate ? toString(schedule.endDate) : null;
  request.startDate = toString(schedule.startDate);
  return request;
}

interface ScheduleRequest {
  startDate: string;
  endDate: string | null;
  cadency: TimeSpan;
  duration: TimeSpan;
  daysOfWeek: DaysOfWeek | null;
}