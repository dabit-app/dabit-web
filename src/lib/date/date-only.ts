import type {DayOfWeek} from "./day-of-week";

/* Motivation:
 Don't want to deal with utc/timezone/external-deps/daylight-saving/0-indexed-month/etc...
 So here we go with a _simple_ DateOnly wrapper.
 C# will have one natively coming with .net6 which the backend will use.
*/

/* Type */

export interface DateOnly {
  year: number,
  month: number;
  day: number;
}

export interface DateOnlyRange {
  from: DateOnly;
  to: DateOnly;
}

/* DateOnly functions */

export function today(): DateOnly {
  return toDateOnly(new Date())
}

export function fromString(str: string): DateOnly {
  return toDateOnly(new Date(str))
}

export function toString(date: DateOnly): string {
  return `${pad(date.year, 4)}-${pad(date.month, 2)}-${pad(date.day, 2)}`
}

export function differenceInDays(from: DateOnly, to: DateOnly) {
  let millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((treatAsUTC(toDate(to)).getTime() - treatAsUTC(toDate(from)).getTime()) / millisecondsPerDay);
}

export function addDays(date: DateOnly, number: number): DateOnly {
  return toDateOnly(new Date(Date.UTC(date.year, date.month - 1, date.day + number)));
}

export function getDayOfWeek(date: DateOnly): DayOfWeek {
  return toDate(date).getDay()
}

export function getDaysInMonth(date: DateOnly): number {
  return new Date(date.year, date.month, 0).getDate()
}

export function toDateOnly(date: Date): DateOnly {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getDate()
  }
}

export function toComparable(date: DateOnly): number {
  return parseInt(pad(date.year, 4) + pad(date.month, 2) + pad(date.day, 2))
}

/* Native date */

export function toDate(date: DateOnly): Date {
  return new Date(toDateNumber(date))
}

function toDateNumber(date: DateOnly): number {
  return Date.UTC(date.year, date.month - 1, date.day);
}

function treatAsUTC(date: Date): Date {
  let result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

function pad(value: number, size: number) {
  let s = String(value);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
}