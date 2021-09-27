<script lang="ts">
  import type {DaysOfWeek} from "../../../../lib/date/day-of-week";
  import * as DaysOfWeekHelper from "../../../../lib/date/day-of-week";
  import DateInput from "../../../../components/common/form/DateInput.svelte";
  import Button from "../../../../components/common/button/Button.svelte";
  import Checkbox from "../../../../components/common/form/Checkbox.svelte";
  import {Schedule, TimeSpan} from "../../../../models/habit";
  import * as DateOnly from "../../../../lib/date/date-only";
  import TimeSpanInput from "../../../../components/common/form/TimeSpanInput.svelte";
  import SelectInput from "../../../../components/common/form/SelectInput.svelte";
  import DaysOfWeekInput from "../../../../components/common/form/DaysOfWeekInput.svelte";
  import SmallCalendar from "../../../../components/calendar/small/SmallCalendar.svelte";
  import {getDurationDayCount} from "../../../../lib/habit/scheduling";

  export let scoped;
  $: habit = scoped.habit

  let startDate: string;
  let endDate: string;
  let useEndDate = false;
  let cadency: TimeSpan | null;
  let duration: TimeSpan | null;
  let daysOfWeek: DaysOfWeek = DaysOfWeekHelper.getEmpty();

  let schedule: Schedule | null;
  let typeOfSchedule: 'none' | 'standard' | 'weekly' = 'none';

  function isScheduleValid(): boolean {
    const dateCorrect = startDate?.length > 0 && (!useEndDate || endDate?.length > 0)
    const standardCorrect = !!cadency && !!duration && getDurationDayCount(duration) <= getDurationDayCount(cadency);
    const weeklyCorrect = !!daysOfWeek;

    switch (typeOfSchedule) {
      case "none":
        return false;
      case "standard":
        return dateCorrect && standardCorrect;
      case "weekly":
        return dateCorrect && weeklyCorrect;
    }
  }

  $: {
    if (!isScheduleValid()) {
      schedule = null;
    } else {
      schedule = {
        startDate: DateOnly.fromString(startDate),
        endDate: useEndDate ? DateOnly.fromString(endDate) : null,
      } as Schedule;

      if (typeOfSchedule === 'standard') {
        schedule.cadency = cadency
        schedule.duration = duration;
        schedule.daysOfWeek = null;
      }

      if (typeOfSchedule === 'weekly') {
        schedule.cadency = {count: 1, unit: 'week'} as TimeSpan
        schedule.duration = {count: 1, unit: 'week'} as TimeSpan
        schedule.daysOfWeek = daysOfWeek
      }
    }
  }
</script>


<div class="text-5xl pb-10 text-center">Set a schedule</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
  <div>
    <div class="text-2xl text-center pb-2">Setup</div>

    <div class="flex mt-2">
      <div class="w-8"></div>
      <DateInput id="start-date" label="Start date" labelClass="w-22" bind:value={startDate} className="flex-auto"/>
    </div>

    <div class="flex mt-2">
      <Checkbox bind:checked={useEndDate} className="pr-2 pt-1 w-8"/>
      <DateInput id="end-date" label="End date" labelClass="w-22" bind:value={endDate} disabled={!useEndDate} className="flex-auto"/>
    </div>

    <div class="flex justify-center pt-2">
      <SelectInput bind:value={typeOfSchedule}>
        <option value="none">-</option>
        <option value="standard">Standard</option>
        <option value="weekly">Weekly</option>
      </SelectInput>
    </div>

    {#if typeOfSchedule === 'none'}
      <p class="opacity-50 text-center pt-2">Please select a type of schedule to continue</p>
    {:else if typeOfSchedule === 'standard'}
      <TimeSpanInput id="cadency" label="Repeat every" labelClass="w-40" bind:value={cadency} className="mt-2"/>
      <TimeSpanInput id="duration" label="Duration" labelClass="w-40" bind:value={duration} className="mt-2"/>
    {:else if typeOfSchedule === 'weekly'}
      <DaysOfWeekInput bind:value={daysOfWeek} className="grid gap-4 grid-cols-3 pt-2"/>
    {/if}
  </div>

  <div class="px-6">
    <div class="text-2xl text-center pb-2">Preview</div>
    {#if schedule !== null}
      <SmallCalendar schedule={schedule}/>
    {:else}
      <p class="opacity-50 text-center pt-8 text-2xl">No preview available yet</p>
    {/if}
  </div>
</div>

<div class="pt-4 flex justify-center">
  <Button icon="chevron_left" text="Back to edit menu" href={`/habit/edit/${habit.id}/`}/>
</div>
