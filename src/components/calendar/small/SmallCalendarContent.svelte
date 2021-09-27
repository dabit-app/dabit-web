<script lang="ts">
  import {SpecificMonth} from "../../../lib/date/specific-month";
  import {computeCalendarArray} from "../../../lib/date/calendar/base-schedule-calendar";
  import {ScheduleEvent} from "../../../lib/habit/scheduling";
  import {getSingleLineCalendarEvents} from "../../../lib/date/calendar/single-schedule-calendar";

  export let currentMonth: SpecificMonth;
  export let events: ScheduleEvent[];

  $: baseCalendar = computeCalendarArray(currentMonth);
  $: calendarEvents = getSingleLineCalendarEvents(events, currentMonth)

  // making day of week labels
  let formatDaysName = Intl.DateTimeFormat("en-US", {weekday: "narrow"});
  $: dayOfCurrentMonth = (day) => new Date(Date.UTC(currentMonth.year, currentMonth.month - 1, day));
  $: daysOfWeeksName = [...baseCalendar].splice(7, 7).map(day => formatDaysName.format(dayOfCurrentMonth(day)));
</script>

<div class="grid grid-cols-7 gap-4 pb-3">
  {#each daysOfWeeksName as dayName}
    <p class="text-center">{dayName}</p>
  {/each}
</div>

<div id="layers">
  <div id="background-layer" class="grid grid-cols-7 gap-2 z-1 w-full h-full">
    {#each baseCalendar as day}
      {#if day !== undefined}
        {#if day in calendarEvents}
          <div style={calendarEvents[day].styles}>
            <div class="bg-orange-400 {calendarEvents[day].classes} relative h-6"></div>
          </div>
        {:else}
          <div class="bg-warm-gray-100 dark:bg-dark-400 h-6"></div>
        {/if}
      {:else}
        <div class="h-6"></div>
      {/if}
    {/each}
  </div>

  <div id="numbers-layer" class="grid grid-cols-7 gap-2 z-2 w-full h-full">
    {#each baseCalendar as day}
      {#if day !== undefined}
        <div class="text-center h-6">{day}</div>
      {:else}
        <div></div>
      {/if}
    {/each}
  </div>
</div>

<style>
  #layers {
    display: grid;
    grid-template: 1fr / 1fr;
  }

  #layers > * {
    grid-column: 1 / 1;
    grid-row: 1 / 1;
  }
</style>
