<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { GameKind, MessageType, type Outcome } from '$lib/model';
	import { messageStore } from '$lib/stores';
	import Loader from '../blocks/Loader.svelte';
	import TimeInput from '../blocks/TimeInput.svelte';

	let { outcome = $bindable() }: { outcome: Outcome | null } = $props();
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
	const modalId = 'outcome-modal';

	async function save(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
		outcome: Outcome
	) {
		const form = new FormData(event.currentTarget);
		let data = form.get('data');

		// because data is required, it has to be present here
		let updatedOutcome = { ...outcome, data: data!.toString() };
		await update(event, updatedOutcome);
	}

	async function update(event: Event, outcomeToUpdate: Outcome) {
		event.preventDefault();
		let res = await fetch(`${baseUrl}/outcomes`, {
			method: 'PUT',
			headers: {
				// requests won't work without this
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(outcomeToUpdate),
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

		invalidate(`${baseUrl}/outcomes/games/${outcomeToUpdate.game_id}`);
		invalidate(`${baseUrl}/outcomes/teams/${outcomeToUpdate.team_id}`);
		(document.getElementById(modalId) as HTMLDialogElement).close();
		// reset the outcome so we don't accidentally display data when opening again
		outcome = null;
	}
</script>

<!-- always render the modal so document.getElementById works the first time - if we'd use an if around the dialog, it'd not be part of the DOM initially -->
<dialog class="modal" id={modalId}>
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		{#if outcome}
			<form onsubmit={(event) => save(event, outcome!)}>
				<h3 class="font-bold text-xl text-center pb-6">
					{#if outcome.data}
						Ergebnis für
						<a class="link" href={`/games/${outcome.game_id}`}>{outcome.game_name}</a> -
						<a class="link" href={`/teams/${outcome.team_id}`}>{outcome.team_name}</a>
						bearbeiten
					{:else}
						Neues Ergebnis für
						<a class="link" href={`/games/${outcome.game_id}`}>{outcome.game_name}</a>
						- <a class="link" href={`/teams/${outcome.team_id}`}>{outcome.team_name}</a> anlegen
					{/if}
				</h3>

				<div class="flex justify-center">
					<!-- svelte-ignore a11y_autofocus -->
					{#if outcome.game_kind == GameKind.Points}
						<input
							class="input input-bordered"
							name="data"
							type="number"
							placeholder="Punkte"
							required
							value={outcome.data}
							autofocus
						/>
					{:else}
						<TimeInput bind:time={outcome.data} />
					{/if}
				</div>

				<div class="modal-action flex flex-row" class:justify-between={outcome.data != null}>
					{#if outcome.data != null}
						<button class="btn" onclick={(event) => update(event, { ...outcome!, data: null })}
							>Löschen</button
						>
					{/if}
					<button class="btn btn-primary">Speichern</button>
				</div>
			</form>
		{:else}
			<div class="flex justify-center">
				<Loader></Loader>
			</div>
		{/if}
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
