<script lang="ts">
	import { goto } from '$app/navigation';
	import { MessageType, type CreateGame, type CreateTeam } from '$lib/model';
	import { messageStore, yearStore } from '$lib/stores';

	export let data;
	let showYearModal = false;
	let modalContent: HTMLFormElement;
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	// explicitly add the current year as an option if it's somehow not included
	if (!data.years.includes($yearStore)) {
		data.years.push($yearStore);
	}

	// sync year to localStorage, because this depends on a store, it'll be set accordingly
	$: {
		localStorage.setItem('year', $yearStore);
	}

	/**
	 * Close the modal if we click out of it.
	 * @param e
	 */
	function onClickOutside(e: any) {
		if (!modalContent.contains(e.target)) {
			closeYearModal();
		}
	}

	/**
	 * Hide the modal and reset the value of the input.
	 */
	function closeYearModal() {
		showYearModal = false;
	}

	async function createNewYear(event: any) {
		const form = new FormData(event.target);
		closeYearModal();

		let newYear = parseInt(form.get('newYear')!.toString());
		let copyTeams = Boolean(form.get('copyTeams')?.toString());
		let copyGames = Boolean(form.get('copyGames')?.toString());

		if (
			(!copyTeams && !copyGames) ||
			// make sure that items are present if we only copy teams or games
			(copyGames && !copyTeams && data.games.length == 0) ||
			(copyTeams && !copyGames && data.teams.length == 0)
		) {
			messageStore.set({
				type: MessageType.Warn,
				message: `Ein neues Jahr kann nicht ohne Daten angelegt werden.`
			});
			return;
		}

		if (copyTeams) {
			for (let index = 0; index < data.teams.length; index++) {
				const team = data.teams[index];
				let newTeam: CreateTeam = {
					trophy_id: team.trophy_id,
					name: team.name,
					gender: team.gender,
					year: newYear
				};
				let res = await fetch(`${baseUrl}/teams`, {
					method: 'POST',
					headers: {
						// requests won't work without this
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(newTeam),
					credentials: 'include'
				});

				if (res.status != 200) {
					messageStore.set({
						type: MessageType.Error,
						message: `Etwas ist schiefgelaufen: ${await res.text()}`
					});
					return;
				}
			}
			messageStore.set({
				type: MessageType.Success,
				message: `Teams wurden erfolgreich angelegt.`
			});
		}

		if (copyGames) {
			for (let index = 0; index < data.games.length; index++) {
				const game = data.games[index];
				let newGame: CreateGame = {
					trophy_id: game.trophy_id,
					name: game.name,
					kind: game.kind,
					year: newYear
				};
				let res = await fetch(`${baseUrl}/games`, {
					method: 'POST',
					headers: {
						// requests won't work without this
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(newGame),
					credentials: 'include'
				});

				if (res.status != 200) {
					messageStore.set({
						type: MessageType.Error,
						message: `Etwas ist schiefgelaufen: ${await res.text()}`
					});
					return;
				}
			}
			messageStore.set({
				type: MessageType.Success,
				message: `Spiele wurden erfolgreich angelegt.`
			});
		}

		// switch to the new year after we're done
		yearStore.set(`${newYear}`);
		goto(`/overview/pie`);
	}
</script>

<h1 class="absolute-center-x left-1/2 text-4xl font-bold pt-6">Einstellungen</h1>

<div class="w-full flex flex-col items-center pt-20 gap-8">
	<div class="flex flex-row w-1/3 justify-between min-w-96">
		<div class="flex items-center w-full">
			<h2 class="">Jahr der Trophy:</h2>
		</div>

		<select
			name="kind"
			class="select select-bordered w-full max-w-xs"
			required
			bind:value={$yearStore}
		>
			{#each data.years as value}
				<option {value}> {value} </option>
			{/each}
		</select>
	</div>

	<!-- we can only create a new year if we copy something - so something must exist -->
	<button
		class="w-1/3 btn btn-primary"
		class:btn-disabled={data.years.length == 0 && data.games.length == 0}
		on:click={() => (showYearModal = true)}>Bestehende Daten zu neuem Jahr kopieren</button
	>
</div>

{#if showYearModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<dialog class="modal modal-open" on:click={(e) => onClickOutside(e)}>
		<form
			id="confirmation-form"
			class="modal-box"
			bind:this={modalContent}
			on:submit|preventDefault={createNewYear}
		>
			<button
				class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				on:click={closeYearModal}>✕</button
			>

			<h1 class="font-bold text-xl text-center pb-2">Neues Jahr anlegen</h1>

			<div class="flex flex-row w-full justify-between">
				<label class="label cursor-pointer">
					<span class="label-text pr-4">Teams kopieren?</span>
					<input type="checkbox" class="checkbox" name="copyTeams" />
				</label>

				<label class="label cursor-pointer">
					<span class="label-text pr-4">Spiele kopieren?</span>
					<input type="checkbox" class="checkbox" name="copyGames" />
				</label>
			</div>

			<label class="label" for="year">
				<span class="label-text">Jahr</span>
			</label>
			<input
				class="input input-bordered w-full"
				name="newYear"
				type="number"
				required
				min="2024"
				max="2999"
			/>

			<div class="modal-action flex flex-row justify-between">
				<button class="btn btn-secondary" on:click|preventDefault={closeYearModal}>
					Abbrechen
				</button>
				<button class="btn btn-primary">Speichern</button>
			</div>
		</form>
	</dialog>
{/if}
