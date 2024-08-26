<script lang="ts">
	import { goto } from '$app/navigation';
	import { MessageType, type CreateGame, type CreateTeam } from '$lib/model';
	import { messageStore, yearStore } from '$lib/stores';

	export let data;
	let showYearModal = false;
	let showImportModal = false;
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
			closeModals();
		}
	}

	/**
	 * Hide the modal and reset the value of the input.
	 */
	function closeModals() {
		showYearModal = false;
		showImportModal = false;
	}

	async function createNewYear(event: any) {
		const form = new FormData(event.target);
		closeModals();

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

	async function importTeams(event: any) {
		const form = new FormData(event.target);
		closeModals();

		let sheet_name = form.get('sheet_name')!.toString();
		let trophy_id_header = form.get('trophy_id_header')!.toString();
		let name_header = form.get('name_header')!.toString();
		let gender_header = form.get('gender_header')!.toString();
		let year = parseInt(form.get('year')!.toString());
		let file = form.get('file')!;

		// set up the Multipart-Request
		const formData = new FormData();
		formData.append('file', file);
		formData.append(
			'metadata',
			// NOTE we have to wrap in a Blob to set the content-type for the JSON, actix complains otherwise
			new Blob(
				[
					JSON.stringify({
						sheet_name,
						trophy_id_header,
						name_header,
						gender_header,
						year
					})
				],
				{ type: 'application/json' }
			)
		);

		let res = await fetch(`${baseUrl}/import`, {
			method: 'POST',
			// don't set the content-type-header - this is added by the browser which also includes the boundary
			body: formData,
			credentials: 'include'
		});

		if (res.status != 200) {
			messageStore.set({
				type: MessageType.Error,
				message: `Etwas ist schiefgelaufen: ${await res.text()}`
			});
			return;
		}
		messageStore.set({
			type: MessageType.Success,
			message: `Teams wurden erfolgreich angelegt.`
		});

		goto(`/overview/pie`);
	}
</script>

<h1 class="absolute-center-x left-1/2 text-4xl font-bold pt-6">Einstellungen</h1>

<div class="w-full flex flex-col items-center pt-20 gap-8">
	<div class="flex flex-row w-1/3 justify-between min-w-96">
		<div class="flex items-center w-full">
			<h2 class="font-bold">Jahr der Trophy:</h2>
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
		class="w-1/3 btn btn-accent"
		class:btn-disabled={data.years.length == 0 && data.games.length == 0}
		on:click={() => (showYearModal = true)}>Bestehende Daten zu neuem Jahr kopieren</button
	>

	<button class="w-1/3 btn btn-accent" on:click={() => (showImportModal = true)}
		>Teams importieren</button
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
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" on:click={closeModals}
				>✕</button
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
				<button class="btn btn-secondary" on:click|preventDefault={closeModals}> Abbrechen </button>
				<button class="btn btn-primary">Speichern</button>
			</div>
		</form>
	</dialog>
{/if}

{#if showImportModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<dialog class="modal modal-open" on:click={(e) => onClickOutside(e)}>
		<form
			id="confirmation-form"
			class="modal-box"
			bind:this={modalContent}
			on:submit|preventDefault={importTeams}
		>
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" on:click={closeModals}
				>✕</button
			>

			<h1 class="font-bold text-xl text-center pb-2">Teams importieren</h1>

			<div class="flex flex-col gap-2">
				<label class="form-control w-full">
					<div class="flex flex-row w-full justify-between">
						<div class="label">
							<span class="label-text pr-4">Sheet-Name</span>
						</div>
						<input
							type="text"
							class="input input-bordered"
							name="sheet_name"
							value="Teams"
							required
						/>
					</div>
				</label>

				<label class="form-control w-full">
					<div class="flex flex-row w-full justify-between">
						<div class="label">
							<span class="label-text pr-4">Trophy-ID-Spalte</span>
						</div>
						<input
							type="text"
							class="input input-bordered"
							name="trophy_id_header"
							value="ID"
							required
						/>
					</div>
				</label>

				<label class="form-control w-full">
					<div class="flex flex-row w-full justify-between">
						<div class="label">
							<span class="label-text pr-4">Name-Spalte</span>
						</div>
						<input
							type="text"
							class="input input-bordered"
							name="name_header"
							value="Name"
							required
						/>
					</div>
				</label>

				<label class="form-control w-full">
					<div class="flex flex-row w-full justify-between">
						<div class="label">
							<span class="label-text pr-4">Typ-Spalte</span>
						</div>
						<input
							type="text"
							class="input input-bordered"
							name="gender_header"
							value="Typ"
							required
						/>
					</div>
				</label>

				<label class="form-control w-full">
					<div class="flex flex-row w-full justify-between">
						<div class="label">
							<span class="label-text pr-4">Jahr</span>
						</div>
						<input
							type="number"
							class="input input-bordered"
							name="year"
							value={$yearStore}
							required
						/>
					</div>
				</label>

				<label class="form-control w-full">
					<div class="flex flex-row w-full justify-between">
						<div class="label">
							<span class="label-text pr-4">Datei</span>
						</div>
						<input
							type="file"
							name="file"
							class="file-input file-input-bordered file-input-accent"
							required
						/>
					</div>
				</label>
			</div>

			<div class="modal-action flex flex-row justify-between">
				<button class="btn btn-secondary" on:click|preventDefault={closeModals}> Abbrechen </button>
				<button class="btn btn-primary">Importieren</button>
			</div>
		</form>
	</dialog>
{/if}
