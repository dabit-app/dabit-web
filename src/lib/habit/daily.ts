import type {DateOnly} from "../date/date-only";
import type {Habit} from "../../models/habit";
import type {HabitEvent} from './scheduling';
import {getDurationDayCount, getEventFor} from "./scheduling";
import {differenceInDays} from "../date/date-only";

export interface DailyHabitData {
  habit: Habit;
  day: DateOnly;
  event: HabitEvent;
  remainingDays: number;
  duration: number;
}

export function getDailyDataFor(habits: Habit[], date: DateOnly): DailyHabitData[] {
  return habits
    .map((habit: Habit) => ({habit, event: getEventFor(habit, date), day: date}))
    .filter((item: DailyHabitData) => item.event !== undefined)
    .map((item: DailyHabitData) => {
      item.remainingDays = differenceInDays(item.day, item.event.range.to);
      item.duration = getDurationDayCount(item.habit.schedule.duration);
      return item;
    })
}