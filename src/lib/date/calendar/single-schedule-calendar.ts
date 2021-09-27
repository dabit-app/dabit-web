import type {BaseCalendarSlotEvent} from "./base-schedule-calendar";
import {computeBaseCalendarSlotEvent} from "./base-schedule-calendar";
import type {ScheduleEvent} from "../../habit/scheduling";
import type {SpecificMonth} from "../specific-month";
import {getWholeMonthRange} from "../specific-month";

interface SingleLineCalendarEvents {
  [slot: number]: SingleLineSlotEvent
}

interface SingleLineSlotEvent extends BaseCalendarSlotEvent {
  classes: string;
  styles: string;
}

export function getSingleLineCalendarEvents(schedules: ScheduleEvent[], specificMonth: SpecificMonth): SingleLineCalendarEvents {
  const range = getWholeMonthRange(specificMonth);
  const baseEvents = schedules
    .map(schedule => computeBaseCalendarSlotEvent(range, schedule))
    .flat();

  let events = {} as SingleLineCalendarEvents;

  baseEvents.forEach(event => {
    events[event.startOn] = toSingleLineSlotEvent(event);
  });

  return events;
}

function toSingleLineSlotEvent(event: BaseCalendarSlotEvent): SingleLineSlotEvent {
  let classes = [
    event.stickOnLeft ? '' : 'rounded-l-md',
    event.stickOnRight ? '' : 'rounded-r-md'
  ].join(" ");

  let styles = `width: calc(${event.duration * 100}% + ${(event.duration - 1)/2}rem)`;

  return {
    ...event,
    classes,
    styles
  };
}
