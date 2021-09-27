<script lang="ts">
  import Card from "../../../../components/common/card/Card.svelte";
  import Icon from "../../../../components/common/icon/Icon.svelte";
  import Button from "../../../../components/common/button/Button.svelte";

  export let scoped;
  $: habit = scoped.habit

  $: canSetSchedule = !habit.schedule
  const cardClass = "px-4 p-2 h-24 rounded-lg flex flex-row justify-center items-center";
  const disabledClass = 'pointer-events-none opacity-50';
</script>

<div class="max-w-screen-sm mx-auto">
  <div class="text-5xl text-center pb-10">What do you wish to edit ?</div>
  <div class="grid grid-cols-2 gap-8">
    <Card className={cardClass} hoverable href={`/habit/edit/${habit.id}/name`}>
      <Icon>text_fields</Icon>
      <div class="text-xl pl-2">
        Name
      </div>
    </Card>
    <div class={canSetSchedule ? '' : disabledClass}>
      <Card className={cardClass} hoverable href={`/habit/edit/${habit.id}/schedule`}>
        <div class="flex flex-col">
          <div class="flex flex-row">
            <Icon>schedule</Icon>
            <div class="text-xl pl-2">
              Schedule
            </div>
          </div>
          {#if !canSetSchedule}
            <div class="text-sm text-orange-400">Schedule is already set</div>
          {/if}
        </div>
      </Card>
    </div>
  </div>
  <div class="pt-4 flex justify-center">
    <Button icon="chevron_left" text="Back to all habits" href="/habit/all"/>
  </div>
</div>