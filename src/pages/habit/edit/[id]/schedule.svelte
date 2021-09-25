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

  $: {
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
</script>


<div class="text-5xl pb-10 text-center">Set a schedule</div>

<section>
  <DateInput id="start-date" label="Start date" bind:value={startDate}/>

  <div class="flex mt-2">
    <Checkbox bind:checked={useEndDate} className="pr-2 pt-1"/>
    <DateInput id="end-date" label="End date" bind:value={endDate} disabled={!useEndDate} className="flex-auto"/>
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
    <TimeSpanInput id="cadency" label="Cadency" bind:value={cadency} className="mt-2"/>
    <TimeSpanInput id="duration" label="Duration" bind:value={duration} className="mt-2"/>
  {:else if typeOfSchedule === 'weekly'}
    <DaysOfWeekInput bind:value={daysOfWeek} className="pt-2"/>
  {/if}

  <!-- Cadency, Duration, DayOfWeek -->

  <div class="pt-4 flex justify-center">
    <Button icon="chevron_left" text="Back to edit menu" href={`/habit/edit/${habit.id}/`}/>
  </div>
</section>