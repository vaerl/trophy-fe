<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		left,
		right,
		center
	}: {
		title?: string;
		left: Snippet;
		right: Snippet;
		center?: Snippet;
	} = $props();
</script>

<div class="flex flex-row py-6 px-4 w-full">
	<div class="flex flex-row flex-1 gap-4">{@render left()}</div>

	{#if title}
		<div class="flex justify-center flex-1">
			<h1 class="text-6xl font-extrabold">{title}</h1>
		</div>
	{:else if center}
		{@render center()}
	{/if}

	<div class="flex flex-row gap-4 justify-end flex-1">{@render right()}</div>
</div>
