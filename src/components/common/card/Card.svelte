<script lang="ts">
  export let hoverable = false;
  export let className = "";
  export let rounded = true;

  $: hoverClass = hoverable ? 'hover:bg-warm-gray-200 dark:hover:bg-dark-500' : ''
  $: roundedClass = rounded ? 'rounded-md' : '';
</script>

<div class="bg-warm-gray-100 dark:bg-dark-400 {roundedClass} {hoverClass} {className}">
  <slot></slot>
</div>