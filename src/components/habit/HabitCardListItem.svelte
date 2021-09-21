<script lang="ts">
  import Checkbox from "../common/form/Checkbox.svelte";
  import {DailyHabitData} from "../../lib/habit/daily";
  import {markCompletion} from "../../lib/api/dabit-repository";

  export let item: DailyHabitData;

  let checkbox;
  $: checked = item.event.isDone

  async function onClick() {
    await markCompletion(item, !checked)
  }

  function getNumberWithOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;

    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
</script>

<div class="pt-6 px-8 py-4 flex flex-direction {checked ? 'text-gray-400 dark:text-dark-50 line-through' : ''}" on:click={onClick}>
  <Checkbox bind:checked on:click={onClick} bind:this={checkbox}/>
  <span class="pl-2">{item.habit.name}</span>
  {#if item.duration > 1 && item.remainingDays > 1 && !item.event.isDone}
    <span class="pl-2 opacity-50">- {item.remainingDays - 1} more day{item.remainingDays - 1 > 1 ? 's' : ''}</span>
  {/if}
  <div class="flex-grow"></div>
  <span class="">{getNumberWithOrdinal(item.event.index)}</span>
</div>