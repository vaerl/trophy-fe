<script lang="ts">
	import { type Outcome } from '$lib/model';
	import { Datatable, TableHandler, ThFilter } from '@vincjo/datatables';
	import Edit from '../../../components/icons/Edit.svelte';
	import Delete from '../../../components/icons/Delete.svelte';
	import LeftArrow from '../../../components/icons/LeftArrow.svelte';
	import Cog from '../../../components/icons/Cog.svelte';
	import Info from '../../../components/icons/Info.svelte';
	import Plus from '../../../components/icons/Plus.svelte';
	import UserIcon from '../../../components/icons/UserIcon.svelte';
	import Home from '../../../components/icons/Home.svelte';
	import OutcomeModal from '../../../components/modal/OutcomeModal.svelte';
	import type { PageProps } from './$types';
	import DeleteModal from '../../../components/modal/DeleteModal.svelte';
	import Loader from '../../../components/blocks/Loader.svelte';
	import LogoutButton from '../../../components/blocks/LogoutButton.svelte';
	import Navbar from '../../../components/blocks/Navbar.svelte';
	import Stats from '../../../components/blocks/Stats.svelte';
	import ThSort from '../../../components/table/ThSort.svelte';

	let { data }: PageProps = $props();

	let selectedOutcome: Outcome | null = $state(null);
	let openOutcomeTable = $derived.by(async () => {
		let outcomes = await data.outcomes;
		return new TableHandler(
			outcomes.filter((o) => !o.data),
			{ rowsPerPage: 100 }
		);
	});

	let doneOutcomeTable = $derived.by(async () => {
		let outcomes = await data.outcomes;
		return new TableHandler(
			outcomes.filter((o) => o.data),
			{ rowsPerPage: 100 }
		);
	});

	function showOutcomeModal(outcome: Outcome) {
		selectedOutcome = outcome;
		(document.getElementById('outcome-modal') as HTMLDialogElement).showModal();
	}

	function showDeletionModal() {
		(document.getElementById('confirm-deletion-modal') as HTMLDialogElement).showModal();
	}
</script>

<div class="flex flex-col h-full">
	{#await Promise.all([data.item, data.outcomes, openOutcomeTable, doneOutcomeTable])}
		<Navbar>
			{#snippet left()}
				<a href="/settings"><Cog /></a>
				<a href="/overview/pie"><Home /></a>
				<a href="/games"><LeftArrow /></a>
			{/snippet}
			{#snippet right()}
				<button class="h-min cursor-pointer" onclick={showDeletionModal}><Delete /></button>
				<a href="/games/create"> <Plus /> </a>
				<a href="/users"> <UserIcon /> </a>
				<a href="/logs"> <Info /> </a>
				<LogoutButton></LogoutButton>
			{/snippet}
		</Navbar>
		<div class="w-full h-full flex justify-center items-center">
			<Loader></Loader>
		</div>
	{:then [item, outcomes, openOutcomeTable, doneOutcomeTable]}
		<Navbar>
			{#snippet left()}
				<a href="/settings"><Cog /></a>
				<a href="/overview/pie"><Home /></a>
				<a href="/games"><LeftArrow /></a>
			{/snippet}
			{#snippet center()}
				<Stats {item} doneOutcomes={doneOutcomeTable.rows.length} totalOutcomes={outcomes.length}
				></Stats>
			{/snippet}
			{#snippet right()}
				<a href={`/games/${item.id}/edit`} class="ml-6"><Edit /></a>
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
					<Datatable table={openOutcomeTable}>
						<table>
							<!-- make sure to not scroll over title and header -->
							<thead class="bg-white!">
								<tr>
									<ThSort table={openOutcomeTable} field="team_trophy_id" isActive={true}
										>Trophy-ID</ThSort
									>
									<ThSort table={openOutcomeTable} field="team_name">Team</ThSort>
								</tr>
								<tr>
									<ThFilter table={openOutcomeTable} field="team_trophy_id" />
									<ThFilter table={openOutcomeTable} field="team_name" />
								</tr>
							</thead>

							<tbody>
								{#each openOutcomeTable.rows as row}
									<tr>
										<td onclick={() => showOutcomeModal(row)} class="cursor-pointer">
											{row.team_trophy_id}
										</td>
										<td>
											<a href={`/teams/${row.team_id}`} class="link">
												{row.team_name}
											</a>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</Datatable>
				</div>
			</div>
			<div class="divider divider-horizontal"></div>

			<div class="w-1/2 h-full flex flex-col">
				<h1 class="text-2xl font-bold underline text-center">Fertige Teams</h1>
				<div class="overflow-scroll">
					<Datatable table={doneOutcomeTable}>
						<table>
							<!-- make sure to not scroll over title and header -->
							<thead class="bg-white!">
								<tr>
									<ThSort table={doneOutcomeTable} field="team_trophy_id" isActive={true}
										>Trophy-ID</ThSort
									>
									<ThSort table={doneOutcomeTable} field="team_name">Team</ThSort>
									<ThSort table={doneOutcomeTable} field="data">Wert</ThSort>
								</tr>
								<tr>
									<ThFilter table={doneOutcomeTable} field="team_trophy_id" />
									<ThFilter table={doneOutcomeTable} field="team_name" />
									<ThFilter table={doneOutcomeTable} field="data" />
								</tr>
							</thead>

							<tbody>
								{#each doneOutcomeTable.rows as row}
									<tr>
										<td onclick={() => showOutcomeModal(row)} class="cursor-pointer">
											{row.team_trophy_id}
										</td>
										<td>
											<a href={`/teams/${row.team_id}`} class="link">
												{row.team_name}
											</a>
										</td>
										<td onclick={() => showOutcomeModal(row)} class="cursor-pointer">
											{row.data}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</Datatable>
				</div>
			</div>
		</div>

		<OutcomeModal outcome={selectedOutcome}></OutcomeModal>

		<DeleteModal {item}></DeleteModal>
	{/await}
</div>
