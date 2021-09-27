<script lang="ts">
  export let checked;
  export let className;

  export function toggleCheck() {
    checked = !checked;
  }

  const baseClass = "border dark:bg-dark-200 focus:outline-none focus:border-dark-200 focus:dark:border-warm-gray-300 dark:border-dark-700"
  const checkedClass = "bg-warm-gray-100 text-orange-400"
  const uncheckedClass = "opacity-50"

  $: classes = `${baseClass} ${checked ? checkedClass : uncheckedClass}`;
</script>


<div class="cursor-pointer {classes} {className}" on:click on:click|stopPropagation={toggleCheck}>
  <slot></slot>
</div>

