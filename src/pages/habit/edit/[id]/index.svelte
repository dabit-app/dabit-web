<script lang="ts">
  import Card from "../../../../components/common/card/Card.svelte";
  import Icon from "../../../../components/common/icon/Icon.svelte";
  import Button from "../../../../components/common/button/Button.svelte";

  export let scoped;
  $: habit = scoped.habit

  const cardClass = "px-4 py-8 rounded-lg flex flex-row justify-center items-center";
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
    <Card className={cardClass} hoverable href={`/habit/edit/${habit.id}/schedule`}>
      <Icon>schedule</Icon>
      <div class="text-xl pl-2">
        Schedule
      </div>
    </Card>
  </div>
  <div class="pt-4 flex justify-center">
    <Button icon="chevron_left" text="Back to all habits" href="/habit/all"/>
  </div>
</div>