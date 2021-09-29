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
  let failedToFetch = false;

  onMount(async () => {
    while (shouldContinue) {
      const data = await getAllHabits(currentPage)

      if (data.ok) {
        let page = data.val;
        page.items.forEach(habit => {
          results[habit.id] = habit;
        })

        shouldContinue = results.length < page.total;
        currentPage += shouldContinue ? 1 : 0;
        $fetchedResult = (results.length / page.total) * 100;
      } else {
        failedToFetch = true;
        shouldContinue = false;
      }
    }

    if (!failedToFetch)
      habitStore.set(results);
  })

</script>

{#if failedToFetch}
  <div class="max-w-screen-sm mx-auto w-screen-sm flex flex-col items-center">
    <p class="text-5xl">😕</p>
    <p class="text-5xl mt-2">Failed to load</p>
    <p class="text-3xl mt-2 opacity-50">Something went wrong with the server</p>
  </div>
{:else}
  <div class="max-w-screen-sm mx-auto w-screen-sm flex flex-col items-center">
    <p class="text-5xl animate-pulse">🚀</p>
    <p class="text-3xl animate-pulse">Loading your habits ...</p>
    <p class="text-3xl mt-2 animate-pulse">{Math.floor($fetchedResult)}%</p>
  </div>
{/if}