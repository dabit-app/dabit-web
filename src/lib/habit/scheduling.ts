import type {Habit, Schedule, TimeSpan} from "../../models/habit";
import type {DateOnly, DateOnlyRange} from "../date/date-only";
import {addDays, differenceInDays, getDayOfWeek, toComparable} from "../date/date-only";
import type {DaysOfWeek} from "../date/day-of-week";
import {countDaysOfWeek, DayOfWeek, getAllDaysOfWeek, isDaysOfWeekEmpty} from "../date/day-of-week";

export interface HabitSchedule {
  habit: Habit;
  events: HabitEvent[];
}

export interface ScheduleEvent {
  index: number;
  range: DateOnlyRange;
}

export type HabitEvent = ScheduleEvent & { isDone: boolean }

export function getEventFor(habit: Habit, date: DateOnly): HabitEvent | undefined {
  let requestRange = {from: date, to: addDays(date, 1)} as DateOnlyRange;
  let available = getAllWithinFromHabit(requestRange, habit);
  return available.events.find(event => toComparable(date) >= toComparable(event.range.from) && toComparable(date) < toComparable(event.range.to));
}

export function getAllWithinFromHabit(range: DateOnlyRange, habit: Habit): HabitSchedule {
  let scheduleEvents = getAllWithinFromSchedule(range, habit.schedule);

  let habitEvents = scheduleEvents.map(event => {
    let isDone = habit.completions.includes(event.index);
    return {...event, isDone} as HabitEvent;
  });

  return {habit, events: habitEvents};
}

export function getAllWithinFromSchedule(range: DateOnlyRange, schedule: Schedule): ScheduleEvent[] {
  const startNth = getNearestNthFrom(schedule, range.from);

  let results: ScheduleEvent[] = [];
  let currentNth = startNth;
  let shouldContinue = true;

  while (shouldContinue) {
    let nthRange = getDateSpanFor(schedule, currentNth);

    if (schedule.endDate == null || toComparable(nthRange.from) <= toComparable(schedule.endDate))
      results.push({index: currentNth, range: nthRange} as ScheduleEvent)

    currentNth += 1;
    let hasReachedTheEndOfSchedule = schedule.endDate != null && toComparable(nthRange.to) >= toComparable(schedule.endDate);
    let hasReachedTheEndOfTheRange = toComparable(nthRange.to) >= toComparable(range.to);
    shouldContinue = !hasReachedTheEndOfTheRange && !hasReachedTheEndOfSchedule;
  }

  return results;
}

export function getDateSpanFor(schedule: Schedule, nth: number): DateOnlyRange {
  if (schedule.daysOfWeek === null || isDaysOfWeekEmpty(schedule.daysOfWeek))
    return getDateSpanForStandard(schedule, nth);
  else
    return getDateSpanForWeekly(schedule, nth);
}

export function getDurationDayCount(span: TimeSpan): number {
  return span.count * (span.unit === 'week' ? 7 : 1);
}

export function getNearestNthFrom(schedule: Schedule, dateOnly: DateOnly): number {
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

function mapSortDayOfWeek(day: DayOfWeek, weekStartOn: DayOfWeek): number {
  let sortValue = day - weekStartOn;
  if (sortValue < 0)
    sortValue += 7;
  return sortValue;
}

function getDateSpanForStandard(schedule: Schedule, nth: number): DateOnlyRange {
  const from = addDays(schedule.startDate, getDurationDayCount(schedule.cadency) * (nth - 1));
  const to = addDays(from, getDurationDayCount(schedule.duration));

  return {from, to};
}

function getDateSpanForWeekly(schedule: Schedule, nth: number): DateOnlyRange {
  const daysActivatedPerWeek = countDaysOfWeek(schedule.daysOfWeek);
  const currentCadencyDeltaNth = (nth - 1) % daysActivatedPerWeek;
  const daysShiftFromDeltaNth = getDaysShiftFromLocalNth(
    schedule.daysOfWeek,
    getDayOfWeek(schedule.startDate),
    currentCadencyDeltaNth
  );

  const from = addDays(schedule.startDate, getDurationDayCount(schedule.cadency) * Math.floor((nth - 1) / daysActivatedPerWeek));

  if (nth === 2 || nth === 1) {
    console.log(`nth: ${nth} | ${getDayOfWeek(schedule.startDate)}, ${currentCadencyDeltaNth}, ${daysShiftFromDeltaNth}`)
    console.log(from)
  }

  let day = addDays(from, daysShiftFromDeltaNth - 1);

  return {from: day, to: addDays(day, 1)};
}

function getDaysShiftFromLocalNth(days: DaysOfWeek, weekStartOn: DayOfWeek, nth: number): DayOfWeek {
  let daysShift = getAllDaysOfWeek(days)
    .map(o => mapSortDayOfWeek(o, weekStartOn))
    .sort()
    .find((value, index) => index == nth);

  return daysShift + 1;
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