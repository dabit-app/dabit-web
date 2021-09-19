import type {HabitEvent} from "./scheduling";
import type {DateOnlyRange, DateOnly} from "../date/date-only"
import {differenceInDays, getDayOfWeek, getDaysInMonth, toComparable} from "../date/date-only";
import type {SpecificMonth} from "../date/specific-month";
import {getWholeMonthRange} from "../date/specific-month";

type CalendarTakenSlot = 'taken';

interface CalendarSlotEvent {
  duration: number;
  stickOnLeft: boolean;
  stickOnRight: boolean;
  classes: string;
  styles: string;
}

type CalendarEvents = { [day: number]: { [slot: number]: CalendarSlotEvent | CalendarTakenSlot } };

export function computeScheduling(schedules: HabitEvent[][], specificMonth: SpecificMonth): CalendarEvents {
  let events = {} as CalendarEvents;
  let currentMonthRange = getWholeMonthRange(specificMonth);

  initializeEventsWhichEachDayOfTheMonth(specificMonth, events);

  for (let schedule of schedules) {
    for (let habitEvent of schedule) {
      computeSlotsFor(events, currentMonthRange, habitEvent)
    }
  }

  return events;
}

export function computeCalendarArray(date: SpecificMonth): (undefined | number)[] {
  let thisMonth = {year: date.year, month: date.month, day: 1} as DateOnly;
  let numberOfDaysThisMonth = getDaysInMonth(thisMonth);
  let allDaysThisMonth = [...Array(numberOfDaysThisMonth + 1).keys()].slice(1);
  let calendarBeginningShift = getDayOfWeek(thisMonth);

  return [...Array(calendarBeginningShift), ...allDaysThisMonth];
}

function computeSlotsFor(events: CalendarEvents, currentMonthRange: DateOnlyRange, habitEvent: HabitEvent) {
  let cutOnLeft = toComparable(currentMonthRange.from) > toComparable(habitEvent.range.from);
  let cutOnRight = toComparable(currentMonthRange.to) < toComparable(habitEvent.range.to);

  let startOn = cutOnLeft ? currentMonthRange.from : habitEvent.range.from;
  let endOn = cutOnRight ? currentMonthRange.to : habitEvent.range.to;
  let duration = differenceInDays(startOn, endOn);

  let currentIndex = getDayOfWeek(startOn)
  let isNewLine = false;
  let currentEventDayShift = 0;

  while (duration > 0) {
    let lengthAvailable = 7 - currentIndex;
    let eventLength = Math.min(lengthAvailable, duration);

    let event = {
      duration: eventLength,
      stickOnLeft: cutOnLeft || isNewLine,
      stickOnRight: cutOnRight || (eventLength == lengthAvailable && (duration - eventLength) > 0),
      classes: ''
    } as CalendarSlotEvent;

    event.classes += [
      habitEvent.isDone ? '' : 'opacity-20',
      event.stickOnLeft ? '' : 'rounded-l-md ml-4',
      event.stickOnRight ? '' : 'rounded-r-md mr-4'
    ].join(" ");

    let pixelBorder = (event.stickOnRight ? 1 : 0) + (event.stickOnLeft ? 1 : 0);
    event.styles = `width: calc(${event.duration * 100}% + ${event.duration * 2}px - ${pixelBorder}px)`;

    isNewLine = event.stickOnRight;
    duration -= eventLength;
    currentIndex += eventLength;
    if (currentIndex >= 7)
      currentIndex -= 7;

    pushAndReserveNextSlots(startOn.day + currentEventDayShift, events, event);
    currentEventDayShift += event.duration;
  }
}

function initializeEventsWhichEachDayOfTheMonth(specificMonth: SpecificMonth, events: CalendarEvents) {
  let numberOfDaysThisMonth = getDaysInMonth({year: specificMonth.year, month: specificMonth.month, day: 1});
  Array.from(Array(numberOfDaysThisMonth).keys()).forEach(dayNumber => events[dayNumber + 1] = {})
}

function pushAndReserveNextSlots(slotStartOnDay: number, events: CalendarEvents, event: CalendarSlotEvent) {
  let slotTaken = pushAtNextAvailableSlot(slotStartOnDay, events, event);

  let slotShift = slotTaken - Object.keys(events[slotStartOnDay]).length
  for (let i = slotShift; i > 0; i--)
    events[slotStartOnDay][slotTaken - slotShift] = "taken"

  // reserve the slot on the next cases
  if (event.duration > 1) {
    for (let i = 2; i <= event.duration; i++) {
      events[slotStartOnDay + (i - 1)][slotTaken] = "taken";
    }
  }
}

function pushAtNextAvailableSlot(dayNumber: number, events: CalendarEvents, event: CalendarSlotEvent): number {
  let slotNumber = 1;

  while (!isSlotAvailable(slotNumber, dayNumber, dayNumber + event.duration - 1, events)) {
    slotNumber++;
  }

  events[dayNumber][slotNumber] = event

  return slotNumber;
}

function isSlotAvailable(slotNumber: number, from: number, to: number, events: CalendarEvents): boolean {
  for (let i = from; i <= to; i++) {
    if (slotNumber in events[i]) {
      return false;
    }
  }
  return true;
}