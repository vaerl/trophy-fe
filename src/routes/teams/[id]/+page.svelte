<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { GameKind, MessageType, type Outcome, type Team } from '$lib/model';
	import { messageStore } from '$lib/stores.js';
	import { isEnterKeyEvent, isEscapeKeyEvent } from '$lib/util';
	import { Datatable, TableHandler, Th, ThFilter } from '@vincjo/datatables';
	import Edit from '../../../components/icons/Edit.svelte';
	import Delete from '../../../components/icons/Delete.svelte';
	import LeftArrow from '../../../components/icons/LeftArrow.svelte';
	import TimeInput from '../../../components/blocks/TimeInput.svelte';
	import { page } from '$app/state';

	let { data } = $props();
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
	let showDeletion = $state(false);
	let nameInput: string = $state('');

	let modalOutcome: Outcome | null = $state(null);
	let modalContent: HTMLFormElement | undefined = $state();

	let openOutcomeTable = new TableHandler(
		data.outcomes.filter((o) => !o.data),
		{ rowsPerPage: 20 }
	);
	let openOutcomeSort = openOutcomeTable.createSort('game_trophy_id');
	openOutcomeSort.isActive = true;
	// react to new data
	$effect(() => {
		data;
		openOutcomeTable.rows = data.outcomes.filter((o) => !o.data);
	});

	let doneOutcomeTable = new TableHandler(
		data.outcomes.filter((o) => o.data),
		{ rowsPerPage: 20 }
	);
	let doneOutcomeSort = doneOutcomeTable.createSort('game_trophy_id');
	doneOutcomeSort.isActive = true;
	// react to new data
	$effect(() => {
		data;
		doneOutcomeTable.rows = data.outcomes.filter((o) => o.data);
	});

	/**
	 * Close the modal if we click out of it.
	 * @param e
	 */
	function onClickOutside(event: MouseEvent & { currentTarget: EventTarget & HTMLDialogElement }) {
		if (modalContent && !modalContent.contains(event.currentTarget)) {
			modalOutcome = null;
			closeDeletion(event);
		}
	}

	/**
	 'm '* Hide the modal and reset the value of the input.
	 */
	function closeDeletion(event: Event) {
		event.preventDefault();
		showDeletion = false;
		nameInput = '';
	}

	/**
	 * Close the modal when pressing Escape.
	 * @param event
	 */
	function handleKeyDown(event: KeyboardEvent) {
		if (isEscapeKeyEvent(event)) {
			modalOutcome = null;
		}
		// submit outcome-form on enter
		else if (isEnterKeyEvent(event) && modalOutcome != null) {
			let form: HTMLElement | null = document.getElementById('outcome-form');
			if (form != null) {
				(form as HTMLFormElement).requestSubmit();
			}
		}
	}

	async function handleDelete(
		event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
	) {
		event.preventDefault();
		let res = await fetch(`${baseUrl}/teams/${page.params.id}`, {
			method: 'DELETE',
			headers: {
				// requests won't work without this
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});

		if (res.status != 200) {
			messageStore.set({
				type: MessageType.Error,
				message: `Etwas ist schiefgelaufen: ${await res.text()}`
			});
			return;
		}

		// go back to overview after successful creation
		let teamRes: Team = await res.json();
		messageStore.set({
			type: MessageType.Success,
			message: `Team ${teamRes.name} wurde erfolgreich gelöscht.`
		});
		goto(`/teams`);
	}

	async function saveOutcome(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
		outcome: Outcome
	) {
		event.preventDefault();
		// always close the modal once the request is happening
		modalOutcome = null;

		let res = await fetch(`${baseUrl}/outcomes`, {
			method: 'PUT',
			headers: {
				// requests won't work without this
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(outcome),
			credentials: 'include'
		});

		if (res.status != 200) {
			messageStore.set({
				type: MessageType.Error,
				message: `Etwas ist schiefgelaufen: ${await res.text()}`
			});
			return;
		}

		let outcomeRes: Outcome = await res.json();
		messageStore.set({
			type: MessageType.Success,
			message: `Ergebnis für ${outcomeRes.team_name} wurde erfolgreich gespeichert.`
		});
		// This causes the load-function to run again - this is a bit over the top, we'd only need to
		// re-load outcomes.
		invalidateAll();
	}

	async function deleteOutcome(
		event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
		outcome: Outcome
	) {
		event.preventDefault();
		const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
		let updatedOutcome: Outcome = {
			...outcome,
			data: null
		};

		// always close the modal once the request is happening
		modalOutcome = null;

		let res = await fetch(`${baseUrl}/outcomes`, {
			method: 'PUT',
			headers: {
				// requests won't work without this
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updatedOutcome),
			credentials: 'include'
		});

		if (res.status != 200) {
			messageStore.set({
				type: MessageType.Error,
				message: `Etwas ist schiefgelaufen: ${await res.text()}`
			});
			return;
		}

		let outcomeRes: Outcome = await res.json();
		messageStore.set({
			type: MessageType.Success,
			message: `Ergebnis für ${outcomeRes.team_name} wurde erfolgreich gespeichert.`
		});
		// This causes the load-function to run again - this is a bit over the top, we'd only need to
		// re-load outcomes.
		invalidateAll();
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<a href="/teams" class="absolute top-0 left-14 py-6"><LeftArrow /></a>

<!-- this is kinda hacky, but works -->
<div class="absolute right-0 top-0 py-6 mr-40 flex flex-row">
	<a href={`/teams/${data.team.id}/edit`} class="ml-6"><Edit /></a>
	<button class="ml-6" onclick={() => (showDeletion = true)}><Delete /></button>
</div>

<div class="absolute-center-x pt-6">
	<div class="tooltip" data-tip="Zum Bearbeiten klicken.">
		<a href={`/teams/${data.team.id}/edit`}>
			<div class="stats border bg-neutral-content">
				<div class="stat place-items-center">
					<div class="stat-title">Typ</div>
					<div class="stat-value">Team</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">Name</div>
					<div class="stat-value">{data.team.name}</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">Trophy-ID</div>
					<div class="stat-value">{data.team.trophy_id}</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">Typ</div>
					<div class="stat-value">{data.team.gender}</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">Punkte</div>
					<div class="stat-value text-primary">{data.team.points}</div>
				</div>

				<!-- only show percentage if there are any outcomes -->
				{#if data.outcomes.length > 0}
					<div class="stat place-items-center">
						<div class="stat-title">Abgeschlossen</div>
						<div class="stat-value text-secondary">
							{Math.round((doneOutcomeTable.rows.length / data.outcomes.length) * 100)}%
						</div>
					</div>
				{/if}
			</div></a
		>
	</div>
</div>

<div class="flex flex-row pt-20" style="height: calc(100% - 104px);">
	<div class="w-1/2 h-full flex flex-col">
		<h1 class="text-2xl font-bold underline text-center">Offene Spiele</h1>

		<Datatable handler={openOutcomeTable}>
			<table class="table table-zebra">
				<thead class="bg-white">
					<tr>
						<Th handler={openOutcomeTable} orderBy="game_trophy_id">Trophy-ID</Th>
						<Th handler={openOutcomeTable} orderBy="game_name">Spiel</Th>
					</tr>
					<tr>
						<ThFilter handler={openOutcomeTable} filterBy="game_trophy_id" />
						<ThFilter handler={openOutcomeTable} filterBy="game_name" />
					</tr>
				</thead>

				<tbody>
					{#each openOutcomeTable.rows as row}
						<tr>
							<td onclick={() => (modalOutcome = row)} class="cursor-pointer">
								{row.game_trophy_id}
							</td>
							<td>
								<a href={`/games/${row.game_id}`} class="link">
									{row.game_name}
								</a>
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
		<Datatable handler={doneOutcomeTable}>
			<table class="table table-zebra">
				<thead>
					<tr>
						<Th handler={doneOutcomeTable} orderBy="game_trophy_id">Trophy-ID</Th>
						<Th handler={doneOutcomeTable} orderBy="game_name">Spiel</Th>
						<Th handler={doneOutcomeTable} orderBy="data">Wert</Th>
					</tr>
					<tr>
						<ThFilter handler={doneOutcomeTable} filterBy="game_trophy_id" />
						<ThFilter handler={doneOutcomeTable} filterBy="game_name" />
						<ThFilter handler={doneOutcomeTable} filterBy="data" />
					</tr>
				</thead>

				<tbody>
					{#each doneOutcomeTable.rows as row}
						<tr>
							<td onclick={() => (modalOutcome = row)} class="cursor-pointer">
								{row.game_trophy_id}
							</td>
							<td>
								<a href={`/games/${row.game_id}`} class="link">
									{row.game_name}
								</a>
							</td>
							<td onclick={() => (modalOutcome = row)} class="cursor-pointer">
								{row.data}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</Datatable>
	</div>
</div>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
{#if modalOutcome != null}
	<dialog class="modal modal-open" onclick={onClickOutside}>
		<form
			id="outcome-form"
			class="modal-box"
			bind:this={modalContent}
			onsubmit={(event) => saveOutcome(event, modalOutcome!)}
		>
			<button
				class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				onclick={(event) => {
					event.stopPropagation();
					modalOutcome = null;
				}}>✕</button
			>

			<h3 class="font-bold text-xl text-center pb-6">
				{#if modalOutcome.data}
					Ergebnis für
					<a class="link" href={`/games/${modalOutcome.game_id}`}>{modalOutcome.game_name}</a>
					bearbeiten
				{:else}
					Neues Ergebnis für <a class="link" href={`/games/${modalOutcome.game_id}`}
						>{modalOutcome.game_name}</a
					> anlegen
				{/if}
			</h3>

			<div class="flex justify-center">
				<!-- svelte-ignore a11y_autofocus -->
				{#if modalOutcome.game_kind == GameKind.Points}
					<input
						class="input input-bordered"
						name="data"
						type="number"
						placeholder="Punkte"
						bind:value={modalOutcome.data}
						autofocus
					/>
				{:else}
					<TimeInput bind:time={modalOutcome.data} />
				{/if}
			</div>

			<div class="modal-action flex flex-row" class:justify-between={modalOutcome.data != null}>
				{#if modalOutcome.data != null}
					<button
						class="btn"
						onclick={(event) => deleteOutcome(event, { ...modalOutcome!, data: null })}
						>Löschen</button
					>
				{/if}
				<button class="btn btn-primary">Speichern</button>
			</div>
		</form>
	</dialog>
{/if}

{#if showDeletion}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<dialog class="modal modal-open" onclick={onClickOutside}>
		<form id="confirmation-form" class="modal-box" bind:this={modalContent}>
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onclick={closeDeletion}
				>✕</button
			>

			<h1 class="font-bold text-xl text-center pb-2">Team "{data.team.name}" wirklich löschen?</h1>
			<p class="text-center pb-6">Bitte gib den Namen des Teams ein, um es zu löschen.</p>
			<input
				class="input input-bordered w-full"
				name="input"
				type="text"
				required
				bind:value={nameInput}
			/>

			<div class="modal-action flex flex-row justify-between">
				<button class="btn btn-secondary" onclick={closeDeletion}> Abbrechen </button>
				<button
					class="btn btn-primary"
					class:btn-disabled={data.team.name !== nameInput}
					onclick={handleDelete}>Löschen</button
				>
			</div>
		</form>
	</dialog>
{/if}
