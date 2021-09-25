<script lang="ts">
  import Button from "../components/common/button/Button.svelte";
  import {darkMode} from "../stores/theme";
  import {habitStore} from "../stores/habits";
  import LoadHabits from "../components/habit/LoadHabits.svelte";
  import Login from "../components/auth/Login.svelte";
  import {jwt} from "../stores/auth";
  import {logoutIfTokenExpired} from "../lib/auth";

  logoutIfTokenExpired(jwt);

  function toggleDarkMode() {
    darkMode.set(!$darkMode);
  }

  function logoutUser() {
    jwt.set(null)
  }

  $: userIsAuthenticated = $jwt !== null
</script>

<div class="h-full bg-warm-gray-50 dark:bg-dark-700 dark:text-white">
  <div class="max-w-screen-md mx-auto">
    <header>
      <div class="mx-auto flex pt-5">
        <p class="text-4xl mr-5">Dabit</p>

        {#if userIsAuthenticated}
          <Button text="Daily" icon="home" className="mr-2" href="/daily"/>
          <Button text="Calendar" icon="event_available" className="mr-2" href="/calendar"/>
          <Button text="Habits" icon="checklist" className="mr-2" href="/habit/all"/>
        {/if}

        <span class="flex-grow"></span>

        {#if userIsAuthenticated}
          <Button icon="logout" text="logout" className="mr-2" on:click={logoutUser}/>
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
        {#if !userIsAuthenticated}
          <Login/>
        {:else if $habitStore === null}
          <LoadHabits/>
        {:else }
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
