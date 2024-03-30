<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { GameKind, MessageType, type Outcome } from '$lib/model';
	import { messageStore } from '$lib/stores.js';
	import { isEscapeKeyEvent } from '$lib/util';
	import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables';
	import Edit from '../../../components/icons/Edit.svelte';
	import Delete from '../../../components/icons/Delete.svelte';

	export let data;
	export let form;

	$: game = data.game;
	$: outcomes = data.outcomes;

	let modalOutcome: Outcome | null = null;
	let modalContent: HTMLFormElement;

	$: openOutcomeHandler = new DataHandler(
		outcomes.filter((o) => !o.data),
		{ rowsPerPage: 50 }
	);
	$: openOutcomes = openOutcomeHandler.getRows();

	$: doneOutcomeHandler = new DataHandler(
		outcomes.filter((o) => o.data),
		{ rowsPerPage: 50 }
	);
	$: doneOutcomes = doneOutcomeHandler.getRows();

	/**
	 * Close the modal if we click out of it.
	 * @param e
	 */
	function onClickOutside(e: MouseEvent) {
		if (!modalContent.contains(e.target)) {
			modalOutcome = null;
		}
	}

	/**
	 * Close the modal when pressing Escape.
	 * @param event
	 */
	function handleKeyDown(event: KeyboardEvent) {
		if (isEscapeKeyEvent(event)) {
			modalOutcome = null;
		}
	}

	$: {
		if (form?.missing) {
			messageStore.set({
				type: MessageType.Error,
				message: `Das Feld '${form.field}' muss angegeben werden.`
			});
		} else if (form?.unauthorized) {
			messageStore.set({
				type: MessageType.Error,
				message: 'Das Ergebnis konnte nicht gespeichert werden, bitte melde dich erneut an.'
			});
		} else if (form?.miscellaneous) {
			messageStore.set({
				type: MessageType.Error,
				message: `Etwas ist schiefgelaufen: ${form.detail}`
			});
		} else if (form?.success) {
			messageStore.set({
				type: MessageType.Success,
				message: `Ergebnis für ${form.outcome.game_name} wurde erfolgreich gespeichert.`
			});
			// This causes the load-function to run again - this is a bit over the top, we'd only need to
			// re-load outcomes.
			invalidateAll();
		}
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<!-- this is kinda hacky, but works -->
<div class="absolute right-0 top-0 py-6 mr-40 flex flex-row">
	<a href={`/games/${game.id}/edit`} class="ml-6"><Edit /></a>
	<form method="POST" action="?/delete">
		<button class="ml-6"><Delete /></button>
	</form>
</div>

<div class="absolute-center-x left-1/2 pt-6">
	<div class="tooltip" data-tip="Zum Bearbeiten klicken.">
		<a href={`/games/${game.id}/edit`}>
			<div class="stats border">
				<div class="stat place-items-center">
					<div class="stat-title">Name</div>
					<div class="stat-value">{game.name}</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">Trophy-ID</div>
					<div class="stat-value">{game.trophy_id}</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">Typ</div>
					<div class="stat-value">{game.kind}</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">Abgeschlossen</div>
					<div class="stat-value text-secondary">
						{Math.round(($doneOutcomes.length / outcomes.length) * 100)}%
					</div>
				</div>
			</div></a
		>
	</div>
</div>

<div class="flex flex-row h-full pt-20 pb-6 px-4">
	<div class="w-1/2 h-full flex flex-col">
		<h1 class="text-2xl font-bold underline text-center">Offene Spiele</h1>

		<Datatable handler={openOutcomeHandler}>
			<table class="table table-zebra">
				<thead class="bg-white">
					<tr>
						<Th handler={openOutcomeHandler} orderBy="team_trophy_id">Trophy-ID</Th>
						<Th handler={openOutcomeHandler} orderBy="team_name">Team</Th>
					</tr>
					<tr>
						<ThFilter handler={openOutcomeHandler} filterBy="team_trophy_id" />
						<ThFilter handler={openOutcomeHandler} filterBy="team_name" />
					</tr>
				</thead>

				<tbody>
					{#each $openOutcomes as row}
						<tr on:click={() => (modalOutcome = row)} class="cursor-pointer">
							<td>
								{row.team_trophy_id}
							</td>
							<td>
								{row.team_name}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</Datatable>
	</div>

	<div class="divider divider-horizontal"></div>

	<div class="w-1/2 h-full flex flex-col">
		<h1 class="text-2xl font-bold underline text-center">Fertige Spiele</h1>
		<Datatable handler={doneOutcomeHandler}>
			<table class="table table-zebra">
				<thead>
					<tr>
						<Th handler={doneOutcomeHandler} orderBy="team_trophy_id">Trophy-ID</Th>
						<Th handler={doneOutcomeHandler} orderBy="team_name">Team</Th>
						<Th handler={doneOutcomeHandler} orderBy="data">Wert</Th>
					</tr>
					<tr>
						<ThFilter handler={doneOutcomeHandler} filterBy="team_trophy_id" />
						<ThFilter handler={doneOutcomeHandler} filterBy="team_name" />
						<ThFilter handler={doneOutcomeHandler} filterBy="data" />
					</tr>
				</thead>

				<tbody>
					{#each $doneOutcomes as row}
						<tr on:click={() => (modalOutcome = row)} class="cursor-pointer">
							<td>
								{row.team_trophy_id}
							</td>
							<td>
								{row.team_name}
							</td>
							<td>
								{row.data}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</Datatable>
	</div>
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
{#if modalOutcome}
	<dialog class="modal modal-open" on:click={(e) => onClickOutside(e)}>
		<form
			method="POST"
			action="?/save"
			class="modal-box"
			bind:this={modalContent}
			use:enhance={({ formData }) => {
				formData.append('outcome', JSON.stringify(modalOutcome));
				return async ({ result }) => {
					await applyAction(result);
					modalOutcome = null;
				};
			}}
		>
			<h3 class="font-bold text-xl text-center pb-6">
				{#if modalOutcome.data}
					Ergebnis für
					<a class="link" href={`/teams/${modalOutcome.team_id}`}>{modalOutcome.team_name}</a>
					bearbeiten
				{:else}
					Neues Ergebnis für <a class="link" href={`/teams/${modalOutcome.team_id}`}
						>{modalOutcome.team_name}</a
					> anlegen
				{/if}
			</h3>

			<div class="flex justify-center">
				{#if modalOutcome.game_kind == GameKind.Points}
					<input
						class="input input-bordered"
						name="data"
						type="number"
						placeholder="Punkte"
						value={modalOutcome.data}
						required
					/>
				{:else}
					<input class="input input-bordered" name="data" type="text" placeholder="Zeit" required />
				{/if}
			</div>

			<div class="modal-action flex flex-row justify-between">
				<button class="btn" on:click={() => (modalOutcome = null)}>Abbrechen</button>
				<button class="btn btn-neutral">Speichern</button>
			</div>
		</form>
	</dialog>
{/if}
