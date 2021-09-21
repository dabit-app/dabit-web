<script lang="ts">
  import TextInput from "../../../components/common/form/TextInput.svelte";
  import {habitStore} from "../../../stores/habits";
  import Button from "../../../components/common/button/Button.svelte";
  import {changeName} from "../../../lib/api/dabit-repository";

  export let id;

  let inputName = $habitStore[id].name;
  $: habit = $habitStore[id]
  $: hasChanged = inputName != habit?.name

  async function applyChangeName() {
    await changeName(habit, inputName)
  }
</script>

{#if habit}
  <div class="text-5xl pb-10">Edit of "{habit.name}"</div>

  <section>
    <div class="text-3xl pb-3">Change the name</div>
    <div class="flex flex-row items-center">
      <TextInput label="Name" className="pr-3 flex-auto" bind:value={inputName}/>
      <Button icon="check" text="Apply" on:click={applyChangeName} disabled={!hasChanged}/>
    </div>
  </section>
{:else}
  <div class="text-5xl">Not found :(</div>
{/if}