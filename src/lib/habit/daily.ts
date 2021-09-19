import type {DateOnly} from "../date/date-only";
import type {Habit} from "../../models/habit";
import type {HabitEvent} from './scheduling';
import {getEventFor} from "./scheduling";

export interface DailyHabitData {
  habit: Habit;
  day: DateOnly;
  event: HabitEvent;
}

export function getDailyDataFor(habits: Habit[], date: DateOnly): DailyHabitData[] {
  return habits
    .map((habit: Habit) => ({habit, event: getEventFor(habit, date), day: date}))
    .filter((item: DailyHabitData) => item.event !== undefined);
}