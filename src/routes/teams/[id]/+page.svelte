<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { GameKind, MessageType, type Outcome, type Team } from '$lib/model';
	import { messageStore } from '$lib/stores.js';
	import { isEnterKeyEvent, isEscapeKeyEvent } from '$lib/util';
	import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables';
	import Edit from '../../../components/icons/Edit.svelte';
	import Delete from '../../../components/icons/Delete.svelte';
	import { page } from '$app/stores';
	import LeftArrow from '../../../components/icons/LeftArrow.svelte';

	export let data;
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
	let showDeletion = false;
	let nameInput: string;

	$: team = data.team;
	$: outcomes = data.outcomes;

	let modalOutcome: Outcome | null = null;
	let modalContent: HTMLFormElement;

	$: openOutcomeHandler = new DataHandler(
		outcomes.filter((o) => !o.data),
		{ rowsPerPage: 20 }
	);
	$: openOutcomes = openOutcomeHandler.getRows();

	$: doneOutcomeHandler = new DataHandler(
		outcomes.filter((o) => o.data),
		{ rowsPerPage: 20 }
	);
	$: doneOutcomes = doneOutcomeHandler.getRows();

	/**
	 * Close the modal if we click out of it.
	 * @param e
	 */
	function onClickOutside(e: any) {
		if (!modalContent.contains(e.target)) {
			modalOutcome = null;
			closeDeletion();
		}
	}

	/**
	 * Hide the modal and reset the value of the input.
	 */
	function closeDeletion() {
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

	async function handleDelete() {
		let res = await fetch(`${baseUrl}/teams/${$page.params.id}`, {
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

	async function saveOutcome(event: any, outcome: Outcome) {
		const form = new FormData(event.target);
		let value = form.get('data');

		// ignore update if there are no changes
		if (outcome.data === value!.toString()) {
			modalOutcome = null;
			return;
		}

		const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
		let updatedOutcome: Outcome = {
			...outcome,
			data: value!.toString()
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

	async function deleteOutcome(outcome: Outcome) {
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

<svelte:window on:keydown={handleKeyDown} />

<a href="/teams" class="absolute top-0 left-14 py-6"><LeftArrow /></a>

<!-- this is kinda hacky, but works -->
<div class="absolute right-0 top-0 py-6 mr-40 flex flex-row">
	<a href={`/teams/${team.id}/edit`} class="ml-6"><Edit /></a>
	<button class="ml-6" on:click={() => (showDeletion = true)}><Delete /></button>
</div>

<div class="absolute-center-x pt-6">
	<div class="tooltip" data-tip="Zum Bearbeiten klicken.">
		<a href={`/teams/${team.id}/edit`}>
			<div class="stats border bg-neutral-content">
				<div class="stat place-items-center">
					<div class="stat-title">Typ</div>
					<div class="stat-value">Team</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">Name</div>
					<div class="stat-value">{team.name}</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">Trophy-ID</div>
					<div class="stat-value">{team.trophy_id}</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">Typ</div>
					<div class="stat-value">{team.gender}</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">Punkte</div>
					<div class="stat-value text-primary">{team.points}</div>
				</div>

				<!-- only show percentage if there are any outcomes -->
				{#if outcomes.length > 0}
					<div class="stat place-items-center">
						<div class="stat-title">Abgeschlossen</div>
						<div class="stat-value text-secondary">
							{Math.round(($doneOutcomes.length / outcomes.length) * 100)}%
						</div>
					</div>
				{/if}
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
						<Th handler={openOutcomeHandler} orderBy="game_trophy_id">Trophy-ID</Th>
						<Th handler={openOutcomeHandler} orderBy="game_name">Spiel</Th>
					</tr>
					<tr>
						<ThFilter handler={openOutcomeHandler} filterBy="game_trophy_id" />
						<ThFilter handler={openOutcomeHandler} filterBy="game_name" />
					</tr>
				</thead>

				<tbody>
					{#each $openOutcomes as row}
						<tr>
							<td on:click={() => (modalOutcome = row)} class="cursor-pointer">
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
		<Datatable handler={doneOutcomeHandler}>
			<table class="table table-zebra">
				<thead>
					<tr>
						<Th handler={doneOutcomeHandler} orderBy="game_trophy_id">Trophy-ID</Th>
						<Th handler={doneOutcomeHandler} orderBy="game_name">Spiel</Th>
						<Th handler={doneOutcomeHandler} orderBy="data">Wert</Th>
					</tr>
					<tr>
						<ThFilter handler={doneOutcomeHandler} filterBy="game_trophy_id" />
						<ThFilter handler={doneOutcomeHandler} filterBy="game_name" />
						<ThFilter handler={doneOutcomeHandler} filterBy="data" />
					</tr>
				</thead>

				<tbody>
					{#each $doneOutcomes as row}
						<tr>
							<td on:click={() => (modalOutcome = row)} class="cursor-pointer">
								{row.game_trophy_id}
							</td>
							<td>
								<a href={`/games/${row.game_id}`} class="link">
									{row.game_name}
								</a>
							</td>
							<td on:click={() => (modalOutcome = row)} class="cursor-pointer">
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
{#if modalOutcome != null}
	<dialog class="modal modal-open" on:click={(e) => onClickOutside(e)}>
		<form
			id="outcome-form"
			class="modal-box"
			bind:this={modalContent}
			on:submit|preventDefault={(event) => saveOutcome(event, modalOutcome)}
		>
			<button
				class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				on:click|stopPropagation={() => (modalOutcome = null)}>✕</button
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
				<!-- svelte-ignore a11y-autofocus -->
				{#if modalOutcome.game_kind == GameKind.Points}
					<input
						class="input input-bordered"
						name="data"
						type="number"
						placeholder="Punkte"
						value={modalOutcome.data}
						autofocus
					/>
				{:else}
					<input
						class="input input-bordered"
						name="data"
						type="text"
						placeholder="Zeit"
						value={modalOutcome.data}
						autofocus
					/>
				{/if}
			</div>

			<div class="modal-action flex flex-row" class:justify-between={modalOutcome.data != null}>
				{#if modalOutcome.data != null}
					<button
						class="btn"
						on:click|preventDefault={(event) => deleteOutcome({ ...modalOutcome, data: null })}
						>Löschen</button
					>
				{/if}
				<button class="btn btn-primary">Speichern</button>
			</div>
		</form>
	</dialog>
{/if}

{#if showDeletion}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<dialog class="modal modal-open" on:click={(e) => onClickOutside(e)}>
		<form id="confirmation-form" class="modal-box" bind:this={modalContent}>
			<button
				class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				on:click={closeDeletion}>✕</button
			>

			<h1 class="font-bold text-xl text-center pb-2">Team "{team.name}" wirklich löschen?</h1>
			<p class="text-center pb-6">Bitte gib den Namen des Teams ein, um es zu löschen.</p>
			<input
				class="input input-bordered w-full"
				name="input"
				type="text"
				required
				bind:value={nameInput}
			/>

			<div class="modal-action flex flex-row justify-between">
				<button class="btn btn-secondary" on:click|preventDefault={closeDeletion}>
					Abbrechen
				</button>
				<button
					class="btn btn-primary"
					class:btn-disabled={team.name !== nameInput}
					on:click|preventDefault={handleDelete}>Löschen</button
				>
			</div>
		</form>
	</dialog>
{/if}
