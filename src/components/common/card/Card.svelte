<script lang="ts">
  import {url} from "@roxi/routify";

  export let hoverable = false;
  export let clickable = false;
  export let className = "";
  export let rounded = true;
  export let href = undefined;

  $: hoverClass = hoverable ? 'hover:bg-warm-gray-200 dark:hover:bg-dark-500' : ''
  $: roundedClass = rounded ? 'rounded-md' : '';
  $: clickableClass = clickable ? 'cursor-pointer' : '';
</script>

{#if href}
  <a href={$url(href)}>
    <div class="bg-warm-gray-100 dark:bg-dark-400 {roundedClass} {hoverClass} {clickableClass} {className}" on:click>
      <slot></slot>
    </div>
  </a>
{:else}
  <div class="bg-warm-gray-100 dark:bg-dark-400 {roundedClass} {hoverClass} {clickableClass} {className}" on:click>
    <slot></slot>
  </div>
{/if}