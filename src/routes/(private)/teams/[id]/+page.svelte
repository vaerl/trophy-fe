<script lang="ts">
	import { type Outcome } from '$lib/model';
	import Delete from '$lib/components/icons/Delete.svelte';
	import Navbar from '$lib/components/blocks/Navbar.svelte';
	import Stats from '$lib/components/blocks/Stats.svelte';
	import Plus from '$lib/components/icons/Plus.svelte';
	import DeleteModal from '$lib/components/modal/DeleteModal.svelte';
	import OutcomeModal from '$lib/components/modal/OutcomeModal.svelte';
	import OutcomeTable from '$lib/components/table/OutcomeTable.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let item = $derived(data.item);
	let outcomes = $derived(data.outcomes);

	let selectedOutcome: Outcome | null = $state(null);

	function showDeletionModal() {
		(document.getElementById('confirm-deletion-modal') as HTMLDialogElement).showModal();
	}

	function showOutcomeModal(outcome: Outcome) {
		selectedOutcome = outcome;
		(document.getElementById('outcome-modal') as HTMLDialogElement).showModal();
	}
</script>

<div class="flex flex-col h-full">
	<Navbar>
		{#snippet center()}
			<Stats {item} {outcomes}></Stats>
		{/snippet}
		{#snippet right()}
			<button class="h-min cursor-pointer" onclick={showDeletionModal}><Delete /></button>
			<a href="/teams/create"> <Plus /> </a>
		{/snippet}
	</Navbar>

	<div class="flex flex-row grow overflow-hidden">
		<div class="w-1/2 h-full flex flex-col">
			<h1 class="text-2xl font-bold underline text-center">Offene Spiele</h1>

			<div class="flex overflow-scroll grow">
				<OutcomeTable
					fields={['game_trophy_id', 'game_name']}
					{outcomes}
					target="open"
					{showOutcomeModal}
				></OutcomeTable>
			</div>
		</div>
		<div class="divider divider-horizontal"></div>

		<div class="w-1/2 h-full flex flex-col">
			<h1 class="text-2xl font-bold underline text-center">Fertige Spiele</h1>
			<div class="flex overflow-scroll grow">
				<OutcomeTable
					fields={['game_trophy_id', 'game_name', 'data']}
					{outcomes}
					target="done"
					{showOutcomeModal}
				></OutcomeTable>
			</div>
		</div>
	</div>

	<OutcomeModal bind:outcome={selectedOutcome}></OutcomeModal>
	<DeleteModal {item}></DeleteModal>
</div>
