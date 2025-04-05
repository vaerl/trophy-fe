<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { GameKind, MessageType, type Game, type Outcome } from '$lib/model';
	import { messageStore } from '$lib/stores.js';
	import { isEnterKeyEvent, isEscapeKeyEvent } from '$lib/util';
	import { Datatable, TableHandler, Th, ThFilter, ThSort } from '@vincjo/datatables';
	import Edit from '../../../components/icons/Edit.svelte';
	import Delete from '../../../components/icons/Delete.svelte';
	import LeftArrow from '../../../components/icons/LeftArrow.svelte';
	import TimeInput from '../../../components/TimeInput.svelte';
	import { page } from '$app/state';
	import Navbar from '../../../components/Navbar.svelte';
	import Cog from '../../../components/icons/Cog.svelte';
	import Info from '../../../components/icons/Info.svelte';
	import Plus from '../../../components/icons/Plus.svelte';
	import UserIcon from '../../../components/icons/UserIcon.svelte';
	import LogoutButton from '../../../components/LogoutButton.svelte';
	import Home from '../../../components/icons/Home.svelte';
	import Stats from '../../../components/Stats.svelte';

	let { data } = $props();
	let { outcomes, item } = data;
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
	let showDeletion = $state(false);
	let nameInput: string = $state('');

	let modalOutcome: Outcome | null = $state(null);
	let modalContent: HTMLFormElement | undefined = $state();

	let openOutcomeTable = new TableHandler(
		outcomes.filter((o) => !o.data),
		{ rowsPerPage: 50 }
	);
	let openOutcomeSort = openOutcomeTable.createSort('team_trophy_id');
	openOutcomeSort.isActive = true;
	// react to new data
	$effect(() => {
		openOutcomeTable.rows = outcomes.filter((o) => !o.data);
	});

	let doneOutcomeTable = new TableHandler(
		outcomes.filter((o) => o.data),
		{ rowsPerPage: 50 }
	);
	let doneOutcomeSort = doneOutcomeTable.createSort('team_trophy_id');
	doneOutcomeSort.isActive = true;
	// react to new data
	$effect(() => {
		data;
		doneOutcomeTable.rows = outcomes.filter((o) => o.data);
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
	 * Hide the modal and reset the value of the input.
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

	async function handleDelete(event: Event) {
		event.preventDefault();
		let res = await fetch(`${baseUrl}/games/${page.params.id}`, {
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
	async function saveOutcome(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
		outcome: Outcome
	) {
		event.preventDefault();
		const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

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

<div class="flex flex-col h-full">
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
			<button class="h-min cursor-pointer" onclick={() => (showDeletion = true)}><Delete /></button>
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
								<ThSort table={openOutcomeTable} field="team_trophy_id">Trophy-ID</ThSort>
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
									<td onclick={() => (modalOutcome = row)} class="cursor-pointer">
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
					<table class="table table-zebra">
						<!-- make sure to not scroll over title and header -->
						<thead class="bg-white!">
							<tr>
								<ThSort table={doneOutcomeTable} field="team_trophy_id">Trophy-ID</ThSort>
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
									<td onclick={() => (modalOutcome = row)} class="cursor-pointer">
										{row.team_trophy_id}
									</td>
									<td>
										<a href={`/teams/${row.team_id}`} class="link">
											{row.team_name}
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
	</div>
</div>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
{#if modalOutcome != null}
	<dialog class="modal modal-open" onclick={onClickOutside}>
		modalOutcome can't be null here
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
					<a class="link" href={`/teams/${modalOutcome.team_id}`}>{modalOutcome.team_name}</a>
					bearbeiten
				{:else}
					Neues Ergebnis für <a class="link" href={`/teams/${modalOutcome.team_id}`}
						>{modalOutcome.team_name}</a
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
					<!-- modalOutcome can't be null here-->
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
	<dialog class="modal modal-open" onclick={(e) => onClickOutside(e)}>
		<form id="confirmation-form" class="modal-box" bind:this={modalContent}>
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onclick={closeDeletion}
				>✕</button
			>

			<h1 class="font-bold text-xl text-center pb-2">Spiel "{item.name}" wirklich löschen?</h1>
			<p class="text-center pb-6">Bitte gib den Namen des Spiels ein, um es zu löschen.</p>
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
					class:btn-disabled={item.name !== nameInput}
					onclick={handleDelete}>Löschen</button
				>
			</div>
		</form>
	</dialog>
{/if}
