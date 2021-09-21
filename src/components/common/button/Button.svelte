<script lang="ts">
  import {isActive, url} from '@roxi/routify';
  import ButtonInner from "./ButtonInner.svelte";

  export let href = false;
  export let icon = undefined;
  export let text = undefined;
  export let disabled = false;
  export let className = "";

  let defaultClass = `pt-3 pb-2 px-3 h-11 rounded
      hover:bg-warm-gray-100 dark:hover:bg-dark-500
      active:bg-warm-gray-200 dark:active:bg-dark-400
      hover:text-orange-400 focus:outline-none`;

  $: currentHrefClass = $isActive(href) ? 'bg-warm-gray-100 dark:bg-dark-400 text-orange-400' : '';
  $: disabledClass = disabled ? 'pointer-events-none opacity-50' : '';
</script>

{#if href}
  <a href="{$url(href)}" class="{defaultClass} {currentHrefClass} {className} {disabledClass}">
    <ButtonInner {icon} {text}>
      <slot/>
    </ButtonInner>
  </a>
{:else }
  <button type="button" class="{defaultClass} {className} {disabledClass}" on:click>
    <ButtonInner {icon} {text}>
      <slot/>
    </ButtonInner>
  </button>
{/if}

<style>
  .active {
    @apply bg-orange-200 text-orange-800
  }
</style>