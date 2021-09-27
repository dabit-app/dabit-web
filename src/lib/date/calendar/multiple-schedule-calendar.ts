import type {Habit} from "../../../models/habit";
import type {SpecificMonth} from "../specific-month";
import {getWholeMonthRange} from "../specific-month";
import type {HabitEvent, HabitSchedule} from "../../habit/scheduling";
import type {BaseCalendarSlotEvent} from "./base-schedule-calendar";
import {computeBaseCalendarSlotEvent} from "./base-schedule-calendar";
import {getDaysInMonth} from "../date-only";

type CalendarTakenSlot = 'taken';

type MultilineCalendarEvents = {
  [day: number]: {
    [slot: number]: MultilineCalendarSlotEvent | CalendarTakenSlot
  };
};

interface MultilineCalendarSlotEvent extends BaseCalendarSlotEvent {
  habit: Habit;
  classes: string;
  styles: string;
}

export function getMultilineCalendarEvents(schedules: HabitSchedule[], specificMonth: SpecificMonth): MultilineCalendarEvents {
  const range = getWholeMonthRange(specificMonth);
  let multilineEvents = {} as MultilineCalendarEvents;

  initializeEachDay(specificMonth, multilineEvents);

  for (const habitSchedule of schedules) {
    let events = habitSchedule.events
      .map((habitEvent: HabitEvent) => computeBaseCalendarSlotEvent(range, habitEvent)
        .map(event => toMultilineSlotEvent(habitEvent, event, habitSchedule))
      )
      .flat()

    for(const event of events)
      pushAndReserveNextSlots(event.startOn, multilineEvents, event)
  }

  return multilineEvents;
}

function initializeEachDay(specificMonth: SpecificMonth, events: MultilineCalendarEvents) {
  let numberOfDaysThisMonth = getDaysInMonth({year: specificMonth.year, month: specificMonth.month, day: 1});
  Array.from(Array(numberOfDaysThisMonth).keys()).forEach(dayNumber => events[dayNumber + 1] = {})
}

function toMultilineSlotEvent(habitEvent: HabitEvent, event: BaseCalendarSlotEvent, habitSchedule: HabitSchedule): MultilineCalendarSlotEvent {
  let classes = [
    habitEvent.isDone ? '' : 'opacity-20',
    event.stickOnLeft ? '' : 'rounded-l-md ml-4',
    event.stickOnRight ? '' : 'rounded-r-md mr-4'
  ].join(" ");

  let pixelBorder = (event.stickOnRight ? 1 : 0) + (event.stickOnLeft ? 1 : 0);
  let styles = `width: calc(${event.duration * 100}% + ${event.duration * 2}px - ${pixelBorder}px)`;

  return {
    ...event,
    habit: habitSchedule.habit,
    classes,
    styles
  };
}

function pushAndReserveNextSlots(slotStartOnDay: number, events: MultilineCalendarEvents, event: MultilineCalendarSlotEvent) {
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

function pushAtNextAvailableSlot(dayNumber: number, events: MultilineCalendarEvents, event: MultilineCalendarSlotEvent): number {
  let slotNumber = 1;

  while (!isSlotAvailable(slotNumber, dayNumber, dayNumber + event.duration - 1, events)) {
    slotNumber++;
  }

  events[dayNumber][slotNumber] = event

  return slotNumber;
}

function isSlotAvailable(slotNumber: number, from: number, to: number, events: MultilineCalendarEvents): boolean {
  for (let i = from; i <= to; i++) {
    if (slotNumber in events[i]) {
      return false;
    }
  }
  return true;
}