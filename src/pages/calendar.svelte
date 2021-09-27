<script lang="ts">
  import Calendar from "../components/calendar/Calendar.svelte";
  import {habitStore} from "../stores/habits";
  import {getAllWithinFromHabit} from "../lib/habit/scheduling";
  import {getCurrentMonth, getWholeMonthRange} from "../lib/date/specific-month";

  let currentMonth = getCurrentMonth();

  $: range = getWholeMonthRange(currentMonth);
  $: scheduling = Object.values($habitStore)
    .filter(habit => !!habit.schedule)
    .map(habit => getAllWithinFromHabit(range, habit));

  function onMonthChange(event) {
    currentMonth = event.detail.month;
  }
</script>

<Calendar currentMonth={currentMonth} scheduling={scheduling} on:change={onMonthChange}/>