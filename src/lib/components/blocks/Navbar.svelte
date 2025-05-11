<script lang="ts">
	import type { Snippet } from 'svelte';
	import Loader from './Loader.svelte';

	let {
		title,
		left,
		right,
		center
	}: {
		title?: string | Promise<string>;
		left: Snippet;
		right: Snippet;
		center?: Snippet;
	} = $props();
</script>

<div class="flex flex-row py-6 px-4 w-full">
	<div class="flex flex-row flex-1 gap-4">{@render left()}</div>

	{#if title}
		<div class="flex justify-center flex-1">
			{#await title}
				<Loader></Loader>
			{:then title}
				<h1 class="text-6xl font-extrabold">{title}</h1>
			{/await}
		</div>
	{:else if center}
		{@render center()}
	{/if}

	<div class="flex flex-row gap-4 justify-end flex-1">{@render right()}</div>
</div>
