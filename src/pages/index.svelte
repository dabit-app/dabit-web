<script lang="ts">
  import HabitCardList from '../components/habit/HabitCardList.svelte'
  import {habitStore} from "../stores/habits";
  import {addDays, DateOnly, toComparable, toDate, today} from "../lib/date/date-only";
  import {getDailyDataFor} from "../lib/habit/daily";
  import Button from "../components/common/button/Button.svelte";

  let currentDay: DateOnly = today();

  $: dailyHabitData = getDailyDataFor($habitStore, currentDay);

  // get today's weekday label
  let formatWeekday = Intl.DateTimeFormat("en-US", {weekday: "long"})
  $: labelWeekday = formatWeekday.format(toDate(currentDay));

  let formatTodayDate = Intl.DateTimeFormat("en-US", {year: "numeric", month: "long", day: "numeric"})
  $: labelTodayDate = formatTodayDate.format(toDate(currentDay));

  $: showResetButton = toComparable(currentDay) !== toComparable(today()) ? '' : 'invisible'

  function switchDay(amount: number) {
    currentDay = addDays(currentDay, amount);
  }

  function switchToToday() {
    currentDay = today();
  }
</script>

<div class="max-w-screen-sm mx-auto w-screen-sm">
  <div class="flex pb-2">
    <div class="flex">
      <div class="self-center">
        <Button icon="chevron_left" on:click={() => switchDay(-1)}/>
      </div>
      <div class="flex flex-col min-w-75 items-center">
        <p class="text-5xl py-1 py-5">{labelWeekday}</p>
        <p class="text-xl">{labelTodayDate}</p>
      </div>
      <div class="self-center">
        <Button icon="chevron_right" on:click={() => switchDay(1)}/>
        <Button icon="restart_alt" on:click={switchToToday} className="mr-3 {showResetButton}"/>
      </div>
    </div>
    <div class="flex-grow"></div>
    <div class="flex items-end">
      <p class="text-7xl pr-1 -mb-2">{dailyHabitData.filter(i => i.isDone).length}</p>
      <div class="flex flex-col">
        <p class="font-semibold text-xl">Tasks</p>
        <p class="text-xl">/ {dailyHabitData.length}</p>
      </div>
    </div>
  </div>

  <HabitCardList dailyHabitData={dailyHabitData}/>
</div>
