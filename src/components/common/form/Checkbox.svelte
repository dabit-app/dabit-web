<script lang="ts">
  import Icon from "../icon/Icon.svelte";
  export let checked = false;

  export function toggleCheck() {
    checked = !checked;
  }
</script>

<div class="cursor-pointer" on:click on:click|stopPropagation={toggleCheck}>
  <input bind:checked class="hidden" type="checkbox"/>
  <div>
    {#if checked}
      <Icon>check_box</Icon>
    {:else}
      <Icon>check_box_outline_blank</Icon>
    {/if}
  </div>
</div>