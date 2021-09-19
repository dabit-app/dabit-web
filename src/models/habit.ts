import type {DaysOfWeek} from "../lib/date/day-of-week";
import type {DateOnly} from "../lib/date/date-only";

export interface Habit {
  id: string;
  name: string;
  schedule: Schedule;
  completions: number[];
}

export interface Schedule {
  cadency: TimeSpan;
  duration: TimeSpan;
  daysOfWeek: DaysOfWeek | null;
  endDate: DateOnly | null;
  startDate: DateOnly;
}

export interface TimeSpan {
  count: number;
  unit: "day" | "week";
}