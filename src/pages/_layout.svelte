<script lang="ts">
  import Button from "../components/common/button/Button.svelte";
  import {jwt} from "../stores/auth"
  import {darkMode} from "../stores/theme";
  import {habitStore} from "../stores/habits";
  import LoadHabits from "../components/habit/LoadHabits.svelte";
  import {isActive, redirect} from "@roxi/routify";
  import {get} from "svelte/store";

  function toggleDarkMode() {
    darkMode.set(!$darkMode);
  }

  if (get(jwt) === null) {
    $redirect('/auth/login')
  }
</script>

<div class="h-full bg-warm-gray-50 dark:bg-dark-700 dark:text-white">
  <div class="max-w-screen-md mx-auto">
    <header>
      <div class="mx-auto flex pt-5">
        <p class="text-4xl mr-5">Dabit</p>

        {#if $jwt !== null}
          <Button text="Home" icon="home" className="mr-2" href="/"/>
          <Button text="Calendar" icon="event_available" className="mr-2" href="/calendar"/>
        {/if}

        <span class="flex-grow"></span>

        {#if $jwt === null}
          <Button icon="login" text="login" className="mr-2" href="/auth/login"/>
        {:else}
          <Button icon="logout" text="logout" className="mr-2" href="/auth/logout"/>
        {/if}

        {#if $darkMode}
          <Button icon="light_mode" on:click={toggleDarkMode}/>
        {:else}
          <Button icon="dark_mode" on:click={toggleDarkMode}/>
        {/if}
      </div>
    </header>

    <main>
      <div class="flex flex-col justify-center mx-auto pt-20">
        {#if !$isActive('/auth') && $habitStore === null}
          <LoadHabits/>
        {:else}
          <slot/>
        {/if}
      </div>
    </main>
  </div>
</div>

<style>
  :root {
    font-family: 'Roboto', sans-serif;
    @apply h-full
  }
</style>
