import type {DateOnlyRange} from "./date-only";
import {toDateOnly} from "./date-only";

export interface SpecificMonth {
  year: number;
  month: number;
}

export function getCurrentMonth(): SpecificMonth {
  return {
    year: new Date().getUTCFullYear(),
    month: new Date().getUTCMonth() + 1
  }
}

export function addMonth(month: SpecificMonth, amount: number): SpecificMonth {
  let date = new Date(Date.UTC(month.year, month.month + amount))
  return {year: date.getUTCFullYear(), month: date.getUTCMonth()}
}

export function getWholeMonthRange(specificMonth: SpecificMonth): DateOnlyRange {
  return {
    from: toDateOnly(new Date(Date.UTC(specificMonth.year, specificMonth.month - 1, 1))),
    to: toDateOnly(new Date(Date.UTC(specificMonth.year, specificMonth.month, 1)))
  }
}

export function toComparableMonth(specificMonth: SpecificMonth): number {
  return parseInt("" + specificMonth.year + specificMonth.month)
}