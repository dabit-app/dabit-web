<script lang="ts">
  import Icon from "../icon/Icon.svelte";

  export let icon = undefined;
  export let text = undefined;
</script>

{#if !!icon && !!text}
  <div class="flex flex-row justify-center">
    <Icon>{icon}</Icon>
    <p class="pl-2">{text}</p>
  </div>
{:else if !!icon}
  <Icon>{icon}</Icon>
{:else if !!text}
  <p>{text}</p>
{:else}
  <slot/>
{/if}