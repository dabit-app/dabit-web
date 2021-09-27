<script lang="ts">
  import type {Schedule} from "../../../models/habit";
  import SmallCalendarContent from "./SmallCalendarContent.svelte";
  import {addMonth, getCurrentMonth, getWholeMonthRange, toComparableMonth} from "../../../lib/date/specific-month";
  import {getAllWithinFromSchedule} from "../../../lib/habit/scheduling";
  import Button from "../../common/button/Button.svelte";
  import {toDate} from "../../../lib/date/date-only";

  export let schedule: Schedule;

  let currentMonth = getCurrentMonth();
  $: range = getWholeMonthRange(currentMonth);
  $: scheduling = getAllWithinFromSchedule(range, schedule);

  let formatMonthYear = Intl.DateTimeFormat("en-US", {year: "numeric", month: "short"})
  $: labelYearMonth = formatMonthYear.format(toDate(range.from));

  $: showResetButton = toComparableMonth(currentMonth) !== toComparableMonth(getCurrentMonth()) ? '' : 'invisible';

  function changeMonth(amount) {
    currentMonth = addMonth(currentMonth, amount);
  }

  function resetDate() {
    currentMonth = getCurrentMonth();
  }
</script>

<div class="flex flex-col mb-4">
  <div class="flex flex-row justify-center items-baseline">
    <Button icon="restart_alt" on:click={resetDate} className="mr-3 {showResetButton}"/>
    <Button icon="chevron_left" on:click={() => changeMonth(-1)}/>
    <p class="text-2xl px-3 min-w-32 text-center">{labelYearMonth}</p>
    <Button icon="chevron_right" on:click={() => changeMonth(1)}/>
    <Button icon="block" className="ml-3 invisible"/>
  </div>
</div>

<SmallCalendarContent currentMonth={currentMonth} events={scheduling}/>