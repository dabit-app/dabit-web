<script lang="ts">
  import Icon from "../Icon.svelte";

  export let checked = false;
  export let className = {};

  export function toggleCheck() {
    checked = !checked;
  }
</script>

<div class="cursor-pointer {className}" on:click on:click|stopPropagation={toggleCheck}>
  <div>
    {#if checked}
      <Icon>check_box</Icon>
    {:else}
      <Icon>check_box_outline_blank</Icon>
    {/if}
  </div>
</div>