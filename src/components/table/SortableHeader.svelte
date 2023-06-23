<script lang="ts">
	import DownArrow from '../icons/DownArrow.svelte';
	import UpArrow from '../icons/UpArrow.svelte';

	export let name: string;
	export let show: boolean;
	export let ascending: boolean;
</script>

<div class="flex flex-row cursor-pointer">
	<p class="pr-2">{name}</p>

	{#if show && ascending}
		<UpArrow />
	{:else if show}
		<DownArrow />
	{/if}
</div>
