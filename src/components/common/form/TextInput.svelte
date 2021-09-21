<script lang="ts">
  export let label;
  export let className;
  export let value;

  const inputColorClasses = "border dark:bg-dark-200 focus:border-dark-200 focus:dark:border-warm-gray-300 dark:border-dark-700 focus:outline-none";
</script>


<div class="flex flex-row items-baseline {className}">
  <label for="name-input" class="pr-3">{label}</label>
  <input id="name-input" type="text" class="flex-auto rounded-lg px-3 py-1 {inputColorClasses}" bind:value={value}>
</div>