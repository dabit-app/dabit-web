<script lang="ts">
  import {tweened} from "svelte/motion";
  import {cubicOut} from "svelte/easing";
  import {onMount} from "svelte";
  import {habitStore, IndexedHabit} from "../../stores/habits";
  import {getAllHabits} from "../../lib/api/habit/get-habit";

  let shouldContinue = true;
  let currentPage = 1;
  let results: IndexedHabit = {};

  const fetchedResult = tweened(0, {duration: 500, easing: cubicOut});

  onMount(async () => {
    while (shouldContinue) {
      let data = await getAllHabits(currentPage)

      data.items.forEach(habit => {
        results[habit.id] = habit;
      })

      shouldContinue = results.length < data.total;
      currentPage += shouldContinue ? 1 : 0;
      $fetchedResult = (results.length / data.total) * 100;
    }

    habitStore.set(results);
  })

</script>

<div class="max-w-screen-sm mx-auto w-screen-sm flex flex-col items-center">
  <p class="text-5xl animate-pulse">🚀</p>
  <p class="text-3xl animate-pulse">Loading your habits ...</p>
  <p class="text-3xl mt-2 animate-pulse">{Math.floor($fetchedResult)}%</p>
</div>