<script lang="ts">
	import { type Outcome } from '$lib/model';
	import Delete from '$lib/components/icons/Delete.svelte';
	import LeftArrow from '$lib/components/icons/LeftArrow.svelte';
	import Cog from '$lib/components/icons/Cog.svelte';
	import Info from '$lib/components/icons/Info.svelte';
	import Plus from '$lib/components/icons/Plus.svelte';
	import UserIcon from '$lib/components/icons/UserIcon.svelte';
	import Home from '$lib/components/icons/Home.svelte';
	import OutcomeModal from '$lib/components/modal/OutcomeModal.svelte';
	import type { PageProps } from './$types';
	import DeleteModal from '$lib/components/modal/DeleteModal.svelte';
	import LogoutButton from '$lib/components/blocks/LogoutButton.svelte';
	import Navbar from '$lib/components/blocks/Navbar.svelte';
	import Stats from '$lib/components/blocks/Stats.svelte';
	import OutcomeTable from '$lib/components/table/OutcomeTable.svelte';

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
		{#snippet left()}
			<a href="/settings"><Cog /></a>
			<a href="/overview/pie"><Home /></a>
			<a href="/games"><LeftArrow /></a>
		{/snippet}
		{#snippet center()}
			<Stats {item} {outcomes}></Stats>
		{/snippet}
		{#snippet right()}
			<button class="h-min cursor-pointer" onclick={showDeletionModal}><Delete /></button>
			<a href="/games/create"> <Plus /> </a>
			<a href="/users"> <UserIcon /> </a>
			<a href="/logs"> <Info /> </a>
			<LogoutButton></LogoutButton>
		{/snippet}
	</Navbar>

	<div class="flex flex-row overflow-hidden">
		<div class="w-1/2 h-full flex flex-col">
			<h1 class="text-2xl font-bold underline text-center">Offene Teams</h1>

			<div class="overflow-scroll">
				<OutcomeTable
					fields={['team_trophy_id', 'team_name']}
					{outcomes}
					target="open"
					{showOutcomeModal}
				></OutcomeTable>
			</div>
		</div>
		<div class="divider divider-horizontal"></div>

		<div class="w-1/2 h-full flex flex-col">
			<h1 class="text-2xl font-bold underline text-center">Fertige Teams</h1>
			<div class="overflow-scroll">
				<OutcomeTable
					fields={['team_trophy_id', 'team_name', 'data']}
					{outcomes}
					target="done"
					{showOutcomeModal}
				></OutcomeTable>
			</div>
		</div>
	</div>

	<OutcomeModal outcome={selectedOutcome}></OutcomeModal>
	<DeleteModal {item}></DeleteModal>
</div>
