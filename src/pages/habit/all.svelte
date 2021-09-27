<script lang="ts">
  import {habitStore} from "../../stores/habits";
  import {getNearestNthFrom} from "../../lib/habit/scheduling";
  import {today} from "../../lib/date/date-only";
  import Button from "../../components/common/button/Button.svelte";
  import Icon from "../../components/common/icon/Icon.svelte";

  $: data = Object.values($habitStore)
    .map(habit => ({
      habit,
      doneCount: habit.completions.length,
      upToTodayCount: !!habit.schedule ? getNearestNthFrom(habit.schedule, today()) : null
    }))
</script>

<div class="table" style="border-spacing: 0px 10px">
  <div class="table-header-group">
    <div class="table-row">
      <div class="table-cell">
        <div class="flex flex-row ml-3">
          <Icon>text_fields</Icon>
          <div class="mt-0.1rem ml-1">Name</div>
        </div>
      </div>
      <div class="table-cell">
        <div class="flex flex-row -ml-5">
          <Icon>functions</Icon>
          <div class="mt-0.1rem">Done</div>
        </div>
      </div>
      <div class="table-cell"></div>
    </div>
  </div>
  <div class="table-row-group">
    {#each data as item}
      <div class="table-row rounded-md h-16">
        <div class="table-cell bg-warm-gray-100 dark:bg-dark-400 align-middle w-full">
          <div class="text-xl pl-4">{item.habit.name}</div>
        </div>
        <div class="table-cell bg-warm-gray-100 dark:bg-dark-400 align-middle">
          {#if item.habit.schedule}
            <p>{item.doneCount}/{item.upToTodayCount}</p>
          {:else}
            <div class="pt-3">
              <Icon>timer_off</Icon>
            </div>
          {/if}
        </div>
        <div class="table-cell bg-warm-gray-100 dark:bg-dark-400 align-middle">
          <Button icon="edit" className="mx-3 inline-block" href={`/habit/edit/${item.habit.id}`}/>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .table-cell:first-child {
    border-radius: 0.375rem 0 0 0.375rem;
  }

  .table-cell:last-child {
    border-radius: 0 0.375rem 0.375rem 0;
  }
</style>