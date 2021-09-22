<script lang="ts">
  import DateInput from "../../../../components/common/form/DateInput.svelte";
  import Button from "../../../../components/common/button/Button.svelte";
  import Checkbox from "../../../../components/common/form/Checkbox.svelte";
  import {Schedule, TimeSpan} from "../../../../models/habit";
  import * as DateOnly from "../../../../lib/date/date-only";
  import TimeSpanInput from "../../../../components/common/form/TimeSpanInput.svelte";

  export let scoped;
  $: habit = scoped.habit

  let startDate: string;
  let endDate: string;
  let useEndDate = false;
  let cadency: TimeSpan | null;
  let duration: TimeSpan | null;

  $: schedule = {
    startDate: DateOnly.fromString(startDate),
    endDate: useEndDate ? DateOnly.fromString(endDate) : null,
    cadency, duration
  } as Schedule;
</script>


<div class="text-5xl pb-10 text-center">Set a schedule</div>

<section>
  <DateInput id="start-date" label="Start date" bind:value={startDate}/>

  <div class="flex mt-2">
    <Checkbox bind:checked={useEndDate} className="pr-2 pt-1"/>
    <DateInput id="end-date" label="End date" bind:value={endDate} disabled={!useEndDate} className="flex-auto"/>
  </div>

  <TimeSpanInput id="cadency" label="Cadency" bind:value={cadency} className="mt-2"/>
  <TimeSpanInput id="duration" label="Duration" bind:value={duration} className="mt-2"/>

  <!-- Cadency, Duration, DayOfWeek -->

  <div class="pt-4 flex justify-center">
    <Button icon="chevron_left" text="Back to edit menu" href={`/habit/edit/${habit.id}/`}/>
  </div>
</section>