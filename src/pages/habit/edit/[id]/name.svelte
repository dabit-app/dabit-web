<script lang="ts">
  import TextInput from "../../../../components/common/form/TextInput.svelte";
  import Button from "../../../../components/common/button/Button.svelte";
  import {changeName} from "../../../../lib/api/habit/change-name";

  export let scoped;
  $: habit = scoped.habit

  let inputName = scoped.habit.name;
  $: hasChanged = inputName != habit?.name

  async function applyChangeName() {
    await changeName(habit, inputName)
  }
</script>

<div class="text-5xl pb-10 text-center">Change name for "{habit.name}"</div>

<section>
  <div class="flex flex-row items-center">
    <TextInput label="Name" className="pr-3 flex-auto" bind:value={inputName}/>
    <Button icon="check" text="Apply" on:click={applyChangeName} disabled={!hasChanged}/>
  </div>
  <div class="pt-4 flex justify-center">
    <Button icon="chevron_left" text="Back to edit menu" href={`/habit/edit/${habit.id}`}/>
  </div>
</section>