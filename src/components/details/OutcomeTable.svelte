<script lang="ts">
	import { game, games, outcomes, teams } from '../../lib/stores';
	import { getNameById } from '../../lib/util';
	import OutcomeEdit from '../../components/details/OutcomeEdit.svelte';
	import type { Outcome } from '../../lib/model';
	import Loader from '../Loader.svelte';
	import { page } from '$app/stores';
	import type { DataType, OutcomeStatus } from '$lib/data';

	export let status: OutcomeStatus;
	export let type: DataType;

	let id: number = parseInt($page.params.id);
	let color = status == 'open' ? 'error' : 'success';
	let text = status == 'open' ? 'offene' : 'fertige';
	let filter = status == 'open' ? (o: Outcome) => o.data == null : (o: Outcome) => o.data != null;
	let colName = type == 'game' ? 'Team' : 'Spiel';
	let store = type == 'game' ? teams : games;
	let modalOpen = false;
	let currentOutcome: Outcome = null;

	function loadData() {
		store.get(type);
		outcomes.get(`outcomes/${type}s/${id}`);
	}

	$: gamesLoading = games.loading;
	$: outcomesLoading = outcomes.loading;

	// if the value of modalOpen has changed, load the data -> this indicates that an outcome might have been added from OutcomeEdit
	$: {
		modalOpen = modalOpen;
		// only load new data if the modal was just closed
		if (!modalOpen) {
			loadData();
		}
	}

	async function editOutcome(outcome: Outcome) {
		currentOutcome = outcome;
		// load game to use in modal
		if (type != 'game') {
			await game.get(`games/${outcome.game_id}`);
		}
		modalOpen = true;
	}

	function getLength(array: Outcome[]) {
		return array.filter(filter).length;
	}

	loadData();
</script>

{#if $outcomesLoading || $gamesLoading}
	<Loader />
{:else}
	<!-- TODO add sorting, TODO check overflow-scrolling -->
	<div class="flex flex-col">
		<h3 class="font-extrabold text-3xl text-{color}">
			{getLength($outcomes)}
			{getLength($outcomes) == 1 ? `${text}s Ergebnis` : `${text} Ergebnisse`}
		</h3>
		<table class="table">
			<tr class="cursor-pointer">
				<th>{colName}-ID</th>
				<th>{colName}</th>
				{#if status != 'open'}
					<th>Wert</th>
				{/if}
			</tr>
			{#each $outcomes.filter(filter) as outcome}
				<tr on:click={() => editOutcome(outcome)} class="cursor-pointer">
					<td>{type == 'game' ? outcome.team_trophy_id : outcome.game_trophy_id}</td>
					<td>{getNameById($store, type == 'game' ? outcome.team_id : outcome.game_id).name}</td>
					{#if status != 'open'}
						<td>{outcome.data}</td>
					{/if}
				</tr>
			{/each}
		</table>
	</div>
{/if}

{#if modalOpen}
	<OutcomeEdit game={$game} bind:modalOpen {currentOutcome} />
{/if}
