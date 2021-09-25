export interface DaysOfWeek {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

export function getEmpty(): DaysOfWeek {
  return {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  }
}

export function getAllDaysOfWeek(days: DaysOfWeek): DayOfWeek[] {
  let result: DayOfWeek[] = [];

  if (days.monday)
    result.push(DayOfWeek.Monday);

  if (days.tuesday)
    result.push(DayOfWeek.Tuesday);

  if (days.wednesday)
    result.push(DayOfWeek.Wednesday);

  if (days.thursday)
    result.push(DayOfWeek.Thursday);

  if (days.friday)
    result.push(DayOfWeek.Friday);

  if (days.saturday)
    result.push(DayOfWeek.Saturday);

  if (days.sunday)
    result.push(DayOfWeek.Sunday);

  return result;
}

export function isDaysOfWeekEmpty(days: DaysOfWeek): boolean {
  return !days.monday && !days.tuesday && !days.wednesday &&
    !days.thursday && !days.friday && !days.saturday && !days.sunday;
}

export function countDaysOfWeek(days: DaysOfWeek) {
  return Object.values(days).filter(Boolean).length;
}