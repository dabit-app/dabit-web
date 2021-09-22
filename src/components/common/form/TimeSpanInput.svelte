<script lang="ts">
  import {TimeSpan} from "../../../models/habit";

  export let id;
  export let label = "";
  export let className = "";
  export let value: TimeSpan | null;
  export let disabled = false;

  let count = 1;
  let unit = 'day';

  $: value = validCount ? {unit, count} as TimeSpan : null;
  $: validCount = count != null && count >= 1

  const inputColorClasses = "border dark:bg-dark-200 focus:outline-none";
  const inputBorderColorClasses = "focus:border-dark-200 focus:dark:border-warm-gray-300 dark:border-dark-700";
  const selectClass = [inputColorClasses, inputBorderColorClasses].join(" ");
  $: disabledClass = disabled ? 'opacity-50 pointer-events-none' : '';
  $: inputClass = [inputColorClasses, validCount ? inputBorderColorClasses : 'border-red-400'].join(" ");
</script>


<div class="flex flex-row items-baseline {disabledClass} {className}">
  <label for={id} class="pr-3">{label}</label>
  <input id={id} type="number" min="1" class="flex-auto rounded-lg px-3 py-1 {inputClass}" bind:value={count}>
  <select name="time-span-type" bind:value={unit} class="rounded-lg px-3 py-1.7 ml-2 {selectClass}">
    <option value="day">Day</option>
    <option value="week">Week</option>
  </select>
</div>
