<script lang="ts">
  import Calendar from "../components/calendar/Calendar.svelte";
  import {habitStore} from "../stores/habits";
  import {getAllWithin} from "../lib/habit/scheduling";
  import {getCurrentMonth, getWholeMonthRange} from "../lib/date/specific-month";

  let currentMonth = getCurrentMonth();

  $: range = getWholeMonthRange(currentMonth);
  $: scheduling = Object.values($habitStore).map(habit => getAllWithin(range, habit));

  function onMonthChange(event) {
    currentMonth = event.detail.month;
  }
</script>

<Calendar currentMonth={currentMonth} scheduling={scheduling} on:change={onMonthChange}/>