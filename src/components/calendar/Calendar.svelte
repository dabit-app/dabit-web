<script lang="ts">
  import Button from "../common/button/Button.svelte";
  import Card from "../common/card/Card.svelte";
  import {createEventDispatcher} from "svelte";
  import {computeCalendarArray, computeScheduling} from "../../lib/habit/calendar";
  import {HabitEvent} from "../../lib/habit/scheduling";
  import {addMonth, getCurrentMonth, SpecificMonth, toComparableMonth} from "../../lib/date/specific-month";

  export let currentMonth: SpecificMonth;
  export let scheduling: HabitEvent[][];

  let calendarWidth;
  let dispatch = createEventDispatcher();
  let dayOfCurrentMonth;

  // making the base calendar
  $: baseCalendar = computeCalendarArray(currentMonth);
  $: events = computeScheduling(scheduling, currentMonth)

  // function for convenience
  $: dayOfCurrentMonth = (day) => new Date(Date.UTC(currentMonth.year, currentMonth.month - 1, day));

  // making day of week labels
  let formatDaysName = Intl.DateTimeFormat("en-US", {weekday: "short"});
  $: daysOfWeeksName = [...baseCalendar].splice(7, 7).map(day => formatDaysName.format(dayOfCurrentMonth(day)));

  // making label for current month/year
  let formatMonthYear = Intl.DateTimeFormat("en-US", {year: "numeric", month: "long"})
  $: labelYearMonth = formatMonthYear.format(dayOfCurrentMonth(1));

  // reset button
  $: showResetButton = toComparableMonth(currentMonth) !== toComparableMonth(getCurrentMonth()) ? '' : 'invisible';

  function changeMonth(amount) {
    currentMonth = addMonth(currentMonth, amount);
    dispatch('change', {month: currentMonth})
  }

  function resetDate() {
    currentMonth = getCurrentMonth();
    dispatch('change', {month: currentMonth})
  }
</script>

<div class="flex flex-col mb-12">
  <div class="flex flex-row justify-center items-baseline">
    <Button icon="restart_alt" on:click={resetDate} className="mr-3 {showResetButton}"/>
    <Button icon="chevron_left" on:click={() => changeMonth(-1)}/>
    <p class="text-4xl px-3 min-w-86 text-center">{labelYearMonth}</p>
    <Button icon="chevron_right" on:click={() => changeMonth(1)}/>
    <Button icon="block" className="ml-3 invisible"/>
  </div>
</div>

<div class="grid grid-cols-7 gap-4 pb-3" bind:clientWidth={calendarWidth}>
  {#each daysOfWeeksName as dayName}
    <p class="text-center">{dayName}</p>
  {/each}
</div>

<div id="layers">
  <div id="layer-base" class="grid grid-cols-7 absolute" style="width: {calendarWidth}px">
    {#each baseCalendar as day}
      {#if day !== undefined }
        <Card rounded={false} className="min-h-24 border border-warm-gray-50 dark:border-dark-700 pb-4">
          <p class="text-right pt-1 pr-2 text-warm-gray-300 dark:text-dark-100 font-bold">{day}</p>
          {#each Object.values(events[day]) as event}
            {#if event === 'taken'}
              <div class="h-16px mt-8px"></div>
            {:else}
              <div style={event.styles}>
                <div class="bg-orange-400 h-16px mt-8px {event.classes} relative"></div>
              </div>
            {/if}
          {/each}
        </Card>
      {:else }
        <div></div>
      {/if}
    {/each}
  </div>
</div>
