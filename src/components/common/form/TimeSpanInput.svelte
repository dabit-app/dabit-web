<script lang="ts">
  import {TimeSpan} from "../../../models/habit";
  import SelectInput from "./SelectInput.svelte";

  export let id;
  export let label = "";
  export let className = "";
  export let labelClass = "";
  export let value: TimeSpan | null;
  export let disabled = false;

  let count = 1;
  let unit = 'day';

  $: value = validCount ? {unit, count} as TimeSpan : null;
  $: validCount = count != null && count >= 1

  const inputColorClasses = "border dark:bg-dark-200 focus:outline-none";
  const inputBorderColorClasses = "focus:border-dark-200 focus:dark:border-warm-gray-300 dark:border-dark-700";
  $: disabledClass = disabled ? 'opacity-50 pointer-events-none' : '';
  $: inputClass = [inputColorClasses, validCount ? inputBorderColorClasses : 'border-red-400'].join(" ");
</script>

<div class="flex flex-row items-baseline {disabledClass} {className}">
  <label for={id} class="pr-3 {labelClass}">{label}</label>
  <input id={id} type="number" min="1" class="rounded-lg min-w-24 px-3 py-1 {inputClass}" bind:value={count}>
  <SelectInput name="time-span-type" bind:value={unit}>
    <option value="day">Day</option>
    <option value="week">Week</option>
  </SelectInput>
</div>
