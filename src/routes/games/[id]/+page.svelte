<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { GameKind, MessageType, type Game, type Outcome } from '$lib/model';
	import { messageStore } from '$lib/stores.js';
	import { isEnterKeyEvent, isEscapeKeyEvent } from '$lib/util';
	import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables';
	import Edit from '../../../components/icons/Edit.svelte';
	import Delete from '../../../components/icons/Delete.svelte';
	import { page } from '$app/stores';

	export let data;
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

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
	function onClickOutside(e: any) {
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
		// submit outcome-form on enter
		else if (isEnterKeyEvent(event) && modalOutcome != null) {
			let form: HTMLElement | null = document.getElementById('outcome-form');
			if (form != null) {
				(form as HTMLFormElement).requestSubmit();
			}
		}
	}

	async function handleDelete() {
		let res = await fetch(`${baseUrl}/games/${$page.params.id}`, {
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
		let gameRes: Game = await res.json();
		messageStore.set({
			type: MessageType.Success,
			message: `Spiel ${gameRes.name} wurde erfolgreich gelöscht.`
		});
		goto(`/games`);
	}

	// TODO these outcome-functions can probably be extracted to util or something
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

<!-- this is kinda hacky, but works -->
<div class="absolute right-0 top-0 py-6 mr-40 flex flex-row">
	<a href={`/games/${game.id}/edit`} class="ml-6"><Edit /></a>
	<form on:submit|preventDefault={handleDelete}>
		<button class="ml-6"><Delete /></button>
	</form>
</div>

<div class="absolute-center-x pt-6">
	<div class="tooltip" data-tip="Zum Bearbeiten klicken.">
		<a href={`/games/${game.id}/edit`}>
			<div class="stats border bg-neutral">
				<div class="stat place-items-center">
					<div class="stat-title">Typ</div>
					<div class="stat-value">Spiel</div>
				</div>

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

				<!-- only show percentage if there are any outcomes -->
				{#if outcomes.length > 0}
					<div class="stat place-items-center">
						<div class="stat-title">Abgeschlossen</div>
						<div class="stat-value text-secondary">
							{Math.round(($doneOutcomes.length / outcomes.length) * 100)}%
						</div>
					</div>
				{/if}
			</div>
		</a>
	</div>
</div>

<div class="flex flex-row h-full pt-20 pb-6 px-4">
	<div class="w-1/2 h-full flex flex-col">
		<h1 class="text-2xl font-bold underline text-center">Offene Teams</h1>

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
						<tr>
							<td on:click={() => (modalOutcome = row)} class="cursor-pointer">
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

	<div class="divider divider-horizontal"></div>

	<div class="w-1/2 h-full flex flex-col">
		<h1 class="text-2xl font-bold underline text-center">Fertige Teams</h1>
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
						<tr>
							<td on:click={() => (modalOutcome = row)} class="cursor-pointer">
								{row.team_trophy_id}
							</td>
							<td>
								<a href={`/teams/${row.team_id}`} class="link">
									{row.team_name}
								</a>
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
{#if modalOutcome != null}
	<dialog class="modal modal-open" on:click={(e) => onClickOutside(e)}>
		<form
			id="outcome-form"
			class="modal-box"
			bind:this={modalContent}
			on:submit|preventDefault={(event) => saveOutcome(event, modalOutcome)}
		>
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

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
				<button class="btn btn-neutral">Speichern</button>
			</div>
		</form>
	</dialog>
{/if}
