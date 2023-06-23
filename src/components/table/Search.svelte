<script lang="ts">
  import { searchValue } from '../../lib/stores';
</script>

<div class="relative text-black">
  <input
    bind:value={$searchValue}
    type="search"
    name="search"
    placeholder="Suche"
    class="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-full border-2"
  />
  {#if $searchValue != ''}
    <button
      class="absolute right-0 bottom-2 mt-3 mr-4 border-none"
      on:click={() => searchValue.set('')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 fill-current"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  {/if}
</div>
