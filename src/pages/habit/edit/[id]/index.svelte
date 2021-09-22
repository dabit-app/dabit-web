<script lang="ts">
  import {habitStore} from "../../../../stores/habits";
  import Card from "../../../../components/common/card/Card.svelte";
  import Icon from "../../../../components/common/icon/Icon.svelte";

  export let id;
  $: habit = $habitStore[id]

  const cardClass = "px-4 py-8 rounded-lg flex flex-row justify-center items-center";
</script>

{#if habit}
  <div class="max-w-screen-sm mx-auto">
    <div class="opacity-70 text-xl text-center pb-2">About "{habit.name}"</div>
    <div class="text-5xl text-center pb-10">What do you wish to edit ?</div>
    <div class="grid grid-cols-2 gap-8">
      <Card className={cardClass} hoverable href={`/habit/edit/${habit.id}/name`}>
        <Icon>text_fields</Icon>
        <div class="text-xl pl-2">
          Name
        </div>
      </Card>
      <Card className={cardClass} hoverable href={`/habit/edit/${habit.id}/schedule`}>
        <Icon>schedule</Icon>
        <div class="text-xl pl-2">
          Schedule
        </div>
      </Card>
    </div>
  </div>
{:else}
  <div class="text-5xl">Not found :(</div>
{/if}
