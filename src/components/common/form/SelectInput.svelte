<script lang="ts">
  export let name = '';
  export let value = '';
  export let className = '';

  const classes = "border dark:bg-dark-200 focus:outline-none focus:border-dark-200 focus:dark:border-warm-gray-300 dark:border-dark-700";
</script>

<select name="{name}" bind:value={value} class="min-w-18 rounded-lg px-3 py-1.7 ml-2 {classes} {className}">
  <slot></slot>
</select>
