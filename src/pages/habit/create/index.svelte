<script lang="ts">
  import TextInput from "../../../components/common/form/TextInput.svelte";
  import Button from "../../../components/common/button/Button.svelte";
  import {createHabit} from "../../../lib/api/habit/create-habit";
  import {redirect} from "@roxi/routify";

  let inputName = "";
  let apiLoading = false;
  let apiSucceeded = false;

  $: buttonDisabled = inputName == "" || apiLoading || apiSucceeded;
  $: buttonIcon = apiSucceeded ? 'done_all' : 'add_task';
  $: buttonText = apiSucceeded ? 'Created' : 'Create';

  async function applyCreateHabit() {
    apiLoading = true;
    let result = await createHabit(inputName)

    if (result.ok) {
      let id = result.val.id;
      setTimeout(() => $redirect(`/habit/edit/${id}/schedule`), 1500);
      apiSucceeded = true;
    }

    apiLoading = false;
  }
</script>

<div class="text-5xl pb-10 text-center">Create a new habit</div>
<TextInput id="habit-name" label="Name" className="pr-3 flex-auto" bind:value={inputName}/>
<Button
    icon={buttonIcon}
    text={buttonText}
    className="mx-auto mt-2"
    disabled={buttonDisabled}
    loading={apiLoading}
    on:click={applyCreateHabit}
/>
