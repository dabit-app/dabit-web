import type {Habit, Schedule, TimeSpan} from "../../models/habit";
import type {DateOnly, DateOnlyRange} from "../date/date-only";
import type {DaysOfWeek} from "../date/day-of-week";
import {countDaysOfWeek, DayOfWeek, getAllDaysOfWeek, isDaysOfWeekEmpty} from "../date/day-of-week";
import {addDays, differenceInDays, getDayOfWeek, toComparable} from "../date/date-only";

export interface HabitEvent {
  index: number;
  isDone: boolean;
  range: DateOnlyRange;
}

export function getEventFor(habit: Habit, date: DateOnly): HabitEvent | undefined {
  let requestRange = {from: date, to: addDays(date, 1)} as DateOnlyRange;
  let available = getAllWithin(requestRange, habit);
  return available.find(event => toComparable(date) >= toComparable(event.range.from) && toComparable(date) < toComparable(event.range.to));
}

export function getAllWithin(range: DateOnlyRange, habit: Habit): HabitEvent[] {
  const startNth = getNearestNthFrom(habit.schedule, range.from);

  let results = [];
  let currentNth = startNth;
  let shouldContinue = true;

  while (shouldContinue) {
    let nthRange = getDateSpanFor(habit.schedule, currentNth);
    let isDone = habit.completions.includes(currentNth);

    results.push({index: currentNth, range: nthRange, isDone} as HabitEvent)

    currentNth += 1;
    let hasReachedTheEndOfSchedule = habit.schedule.endDate != null && toComparable(nthRange.to) >= toComparable(habit.schedule.endDate);
    let hasReachedTheEndOfTheRange = toComparable(nthRange.to) >= toComparable(range.to);
    shouldContinue = !hasReachedTheEndOfTheRange && !hasReachedTheEndOfSchedule;
  }

  return results;
}

export function getDateSpanFor(schedule: Schedule, nth: number): DateOnlyRange {
  let from = addDays(schedule.startDate, getDurationDayCount(schedule.cadency) * (nth - 1));
  let to = addDays(from, getDurationDayCount(schedule.duration));

  if (schedule.daysOfWeek === null || isDaysOfWeekEmpty(schedule.daysOfWeek))
    return {from, to};

  const daysActivatedPerWeek = countDaysOfWeek(schedule.daysOfWeek);
  const currentCadencyDeltaNth = nth % daysActivatedPerWeek;
  const daysShiftFromDeltaNth = getDayOfWeekFromLocalNth(
    schedule.daysOfWeek,
    getDayOfWeek(schedule.startDate),
    currentCadencyDeltaNth
  );

  to = addDays(from, daysShiftFromDeltaNth);

  return {from, to};
}

function getNearestNthFrom(schedule: Schedule, dateOnly: DateOnly): number {
  if (toComparable(schedule.startDate) > toComparable(dateOnly))
    return 1;

  if (schedule.endDate != null && toComparable(schedule.endDate) < toComparable(dateOnly))
    return getNearestNthFrom(schedule, schedule.endDate);

  const cadencyTime = Math.floor(differenceInDays(schedule.startDate, dateOnly) / getDurationDayCount(schedule.cadency));

  if (schedule.daysOfWeek === null || isDaysOfWeekEmpty(schedule.daysOfWeek))
    return cadencyTime + 1;

  const daysActivatedPerWeek = countDaysOfWeek(schedule.daysOfWeek);
  const nthDayOfTheWeek = getClosestNthFrom(schedule.daysOfWeek, getDayOfWeek(schedule.startDate), getDayOfWeek(dateOnly));

  return cadencyTime * daysActivatedPerWeek + nthDayOfTheWeek;
}

function getDurationDayCount(span: TimeSpan): number {
  return span.count * (span.unit === 'week' ? 7 : 1);
}

function mapSortDayOfWeek(day: DayOfWeek, weekStartOn: DayOfWeek): number {
  let sortValue = day - weekStartOn;
  if (sortValue < 0)
    sortValue += 7;
  return sortValue;
}

function getDayOfWeekFromLocalNth(days: DaysOfWeek, weekStartOn: DayOfWeek, nth: number): DayOfWeek {
  return getAllDaysOfWeek(days)
    .map(o => ({sort: mapSortDayOfWeek(o, weekStartOn), value: o}))
    .sort((a, b) => a.sort - b.sort)
    .find(o => o.sort == nth)
    .value;
}

function getLocalNthFromDayOfWeek(days: DaysOfWeek, weekStartOn: DayOfWeek, target: DayOfWeek): number | null {
  const nthIndex = getAllDaysOfWeek(days)
    .map(o => ({sort: mapSortDayOfWeek(o, weekStartOn), value: o}))
    .sort((a, b) => a.sort - b.sort)
    .findIndex(o => o.value === target)

  if (nthIndex == -1)
    return null;

  return nthIndex + 1;
}

function getClosestNthFrom(days: DaysOfWeek, weekStartOn: DayOfWeek, target: DayOfWeek): number {
  const possibleDays = getAllDaysOfWeek(days);
  let tmpTarget = target.valueOf()

  while (possibleDays.find(o => o.valueOf() === tmpTarget) === undefined) {
    tmpTarget -= 1;
    if (tmpTarget === -1)
      tmpTarget = 6;
  }

  return getLocalNthFromDayOfWeek(days, weekStartOn, tmpTarget);
}