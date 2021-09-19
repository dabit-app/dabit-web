<script lang="ts">
  import {getAllHabits} from "../../lib/api/dabit-api";
  import {tweened} from "svelte/motion";
  import {cubicOut} from "svelte/easing";
  import {onMount} from "svelte";
  import {habitStore} from "../../stores/habits";

  let shouldContinue = true;
  let currentPage = 1;
  let results = [];

  const fetchedResult = tweened(0, {duration: 500, easing: cubicOut});

  onMount(async () => {
    while (shouldContinue) {
      let data = await getAllHabits(currentPage)
      results.push(...data.items)

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