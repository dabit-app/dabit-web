<script lang="ts">
  import HabitCardListItem from "./HabitCardListItem.svelte";
  import Card from "../common/card/Card.svelte";
  import {DailyHabitData} from "../../lib/habit/daily";

  export let dailyHabitData: DailyHabitData[] = []
</script>

<div class="flex flex-col">
  {#each dailyHabitData as item}
    <Card hoverable className="my-2 cursor-pointer">
      <HabitCardListItem item={item}/>
    </Card>
  {/each}
</div>