<script lang="ts">
  import {habitStore} from "../../../../stores/habits";

  export let id;
  $: habit = $habitStore[id]
</script>

{#if habit !== undefined}
  <div class="opacity-70 text-xl text-center pb-2">About "{habit.name}"</div>
  <slot scoped={{habit: habit}}/>
{:else}
  <div class="text-5xl">Not found :(</div>
{/if}
