<script lang="ts">
  import ListItem from "./ListItem.svelte";

  export let items = []
</script>

<ul class="py-4 py-4">
  {#each items as item}
    <ListItem>
      <slot item={item}></slot>
    </ListItem>
  {/each}
</ul>