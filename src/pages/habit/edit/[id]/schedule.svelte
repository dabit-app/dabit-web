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
  import * as api from "../../../../lib/api/habit/set-schedule";
  import {redirect} from "@roxi/routify";
  import {ApiError, ApiErrorForm} from "../../../../lib/api/common/ApiError";
  import Icon from "../../../../components/common/Icon.svelte";

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
  let isScheduleValid = false;

  $: {
    const dateCorrect = startDate?.length > 0 && (!useEndDate || endDate?.length > 0)
    const standardCorrect = !!cadency && !!duration && getDurationDayCount(duration) <= getDurationDayCount(cadency);
    const weeklyCorrect = !!daysOfWeek;

    switch (typeOfSchedule) {
      case "none":
        isScheduleValid = false;
        break;
      case "standard":
        isScheduleValid = dateCorrect && standardCorrect;
        break;
      case "weekly":
        isScheduleValid = dateCorrect && weeklyCorrect;
        break;
    }
  }

  $: {
    if (!isScheduleValid) {
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

  // api call
  let apiLoading = false;
  let apiErrorMsg: ApiError | null = null;
  let apiErrorForm: ApiErrorForm | null = null;
  let apiSuccess = false;

  async function callApiToSetSchedule() {
    apiErrorMsg = null;
    apiErrorForm = null;
    apiLoading = true;

    const result = await api.setSchedule(habit, schedule);
    apiLoading = false;

    if (result.ok) {
      apiSuccess = true;
      setTimeout(() => $redirect('/habit/all'), 1500);
    } else {
      if ('errors' in result.val) {
        apiErrorForm = result.val as ApiErrorForm;
      } else {
        apiErrorMsg = result.val as ApiError;
      }
    }
  }
</script>


<div class="text-5xl pb-10 text-center">Set a schedule</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
  <div>
    <div class="text-2xl text-center pb-2">Setup</div>

    {#if apiErrorMsg}
      <p class="text-red-500">{apiErrorMsg.detail}</p>
    {/if}

    {#if apiErrorForm}
      <ul class="text-red-500">
        {#each Object.entries(apiErrorForm) as entry}
          <li>{entry[0]}</li>
          <li>
            <ul>
              {#each entry[1] as msg}
                <li>{msg}</li>
              {/each}
            </ul>
          </li>
        {/each}
      </ul>
    {/if}

    <div class="flex mt-2">
      <div class="w-8"></div>
      <DateInput id="start-date" label="Start date" labelClass="w-22" bind:value={startDate} className="flex-auto"/>
    </div>

    <div class="flex mt-2">
      <Checkbox bind:checked={useEndDate} className="pr-2 pt-1 w-8"/>
      <DateInput id="end-date" label="End date" labelClass="w-22" bind:value={endDate} disabled={!useEndDate}
                 className="flex-auto"/>
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
      <DaysOfWeekInput bind:value={daysOfWeek} className="grid gap-2 grid-cols-3 pt-2 text-center"/>
    {/if}

    <div class="flex justify-center pt-2">
      {#if apiSuccess}
        <Icon>done</Icon>
      {:else}
        <Button icon="send" text="Set schedule" disabled={!isScheduleValid} on:click={callApiToSetSchedule}
                loading={apiLoading}/>
      {/if}
    </div>
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
