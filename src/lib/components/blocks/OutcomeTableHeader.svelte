<script lang="ts">
	import type { Outcome } from '$lib/model';
	import { doneOutcomeFilter, openOutcomeFilter } from '$lib/util';
	import Loader from './Loader.svelte';

	let {
		isTeam = true,
		isDone = false,
		items
	}: { isTeam?: boolean; isDone?: boolean; items: Promise<Array<Outcome>> } = $props();

	let text = $derived.by(async () => {
		let outcomes = await items;
		let filter = isDone ? doneOutcomeFilter : openOutcomeFilter;
		let amount = outcomes.filter(filter).length;
		let statusString;
		let nameString;

		// special handling for 1, since 0 should also use plural
		if (amount != 1) {
			statusString = isDone ? 'fertige' : 'offene';
			nameString = isTeam ? 'Spiele' : 'Teams';
		} else {
			console.log(isTeam);
			statusString = isDone ? 'fertiges' : 'offenes';
			nameString = isTeam ? 'Spiel' : 'Team';
		}

		return `${amount} ${statusString} ${nameString}`;
	});
</script>

{#await text}
	<div class="w-full flex justify-center">
		<Loader></Loader>
	</div>
{:then text}
	<h1 class="text-2xl font-bold underline text-center">{text}</h1>
{/await}
