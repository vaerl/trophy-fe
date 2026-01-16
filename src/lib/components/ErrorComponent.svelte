<script lang="ts">
	import Navbar from '$lib/components/blocks/Navbar.svelte';
	import type { CustomError } from '$lib/model';

	let { error }: { error: CustomError } = $props();

	// log the error, use $effect to react to possible changes
	$effect(() => {
		console.error(error);
	});
</script>

<div class="w-full h-full flex flex-col">
	<Navbar title="Fehler" />
	<div class="flex grow text-center items-center justify-center">
		<div class="flex flex-col">
			<h1 class="font-extrabold text-2xl pb-4">
				Ein Fehler ist aufgetreten: {error.status} - {error.body.message}
			</h1>
			<a href="/overview/pie"><h2 class="font-bold link text-xl">Zurück zur Übersicht</h2></a>
		</div>
	</div>
</div>
