import type {SpecificMonth} from "../specific-month";
import type {DateOnly, DateOnlyRange} from "../date-only";
import type {ScheduleEvent} from "../../habit/scheduling";
import {differenceInDays, getDayOfWeek, getDaysInMonth, toComparable} from "../date-only";

export interface BaseCalendarSlotEvent {
  nth: number;
  startOn: number;
  duration: number;
  stickOnLeft: boolean;
  stickOnRight: boolean;
}

export function computeCalendarArray(date: SpecificMonth): (undefined | number)[] {
  let thisMonth = {year: date.year, month: date.month, day: 1} as DateOnly;
  let numberOfDaysThisMonth = getDaysInMonth(thisMonth);
  let allDaysThisMonth = [...Array(numberOfDaysThisMonth + 1).keys()].slice(1);
  let calendarBeginningShift = getDayOfWeek(thisMonth);

  return [...Array(calendarBeginningShift), ...allDaysThisMonth];
}

export function computeBaseCalendarSlotEvent(currentMonthRange: DateOnlyRange, schedule: ScheduleEvent): BaseCalendarSlotEvent[] {
  let cutOnLeft = toComparable(currentMonthRange.from) > toComparable(schedule.range.from);
  let cutOnRight = toComparable(currentMonthRange.to) < toComparable(schedule.range.to);

  let startOn = cutOnLeft ? currentMonthRange.from : schedule.range.from;
  let endOn = cutOnRight ? currentMonthRange.to : schedule.range.to;
  let duration = differenceInDays(startOn, endOn);

  let currentIndex = getDayOfWeek(startOn)
  let isNewLine = false;
  let currentEventDayShift = 0;

  let slotEvents = [];

  while (duration > 0) {
    let lengthAvailable = 7 - currentIndex;
    let eventLength = Math.min(lengthAvailable, duration);

    let calendarSlotEvent = {
      nth: schedule.index,
      startOn: startOn.day + currentEventDayShift,
      duration: eventLength,
      stickOnLeft: cutOnLeft || isNewLine,
      stickOnRight: cutOnRight || (eventLength == lengthAvailable && (duration - eventLength) > 0),
    } as BaseCalendarSlotEvent;

    isNewLine = calendarSlotEvent.stickOnRight;
    duration -= eventLength;
    currentIndex += eventLength;
    if (currentIndex >= 7)
      currentIndex -= 7;

    currentEventDayShift += calendarSlotEvent.duration;
    slotEvents.push(calendarSlotEvent);
  }

  return slotEvents;
}
