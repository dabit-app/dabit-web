<script lang="ts">
  import {DaysOfWeek} from "../../../lib/date/day-of-week";
  import ToggleCardInput from "./ToggleCardInput.svelte";

  export let value: DaysOfWeek;
  export let className = "";

  const itemClass = "px-2 py-2 rounded-md";
</script>

<div class="{className}">
  <ToggleCardInput bind:checked={value.sunday} className={itemClass}>Sunday</ToggleCardInput>
  <ToggleCardInput bind:checked={value.monday} className={itemClass}>Monday</ToggleCardInput>
  <ToggleCardInput bind:checked={value.tuesday} className={itemClass}>Tuesday</ToggleCardInput>
  <ToggleCardInput bind:checked={value.wednesday} className={itemClass}>Wednesday</ToggleCardInput>
  <ToggleCardInput bind:checked={value.thursday} className={itemClass}>Thursday</ToggleCardInput>
  <ToggleCardInput bind:checked={value.friday} className={itemClass}>Friday</ToggleCardInput>
  <ToggleCardInput bind:checked={value.saturday} className={itemClass}>Saturday</ToggleCardInput>
</div>
