<script lang="ts">
  export let id;
  export let label = "";
  export let className = "";
  export let value = "";
  export let disabled = false;

  const inputColorClasses = "border dark:bg-dark-200 focus:border-dark-200 focus:dark:border-warm-gray-300 dark:border-dark-700 focus:outline-none";
  $: disabledClass = disabled ? 'opacity-50 pointer-events-none' : '';
</script>


<div class="flex flex-row items-baseline {disabledClass} {className}">
  <label for={id} class="pr-3">{label}</label>
  <input id={id} type="date" class="flex-auto rounded-lg px-3 py-1 {inputColorClasses}" bind:value={value}>
</div>