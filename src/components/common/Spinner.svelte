<script lang="ts">
  export let className = "";
  export let size = 64;
</script>

<div style="width: {size}px; height: {size}px" class="spinner bg-gray-800 dark:bg-warm-gray-100 {className}"></div>

<style>
  .spinner {
    border-radius: 100%;
    animation: scaleout 1.0s infinite ease-in-out;
  }

  @keyframes scaleout {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1.0);
      opacity: 0;
    }
  }
</style>