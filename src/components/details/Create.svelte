<script lang="ts">
	import { goto } from '$app/navigation';
	import type { HttpStore } from '$lib/httpStore';
	import type { DataType, Field } from '../../lib/data';
	import { localize } from '../../lib/localize';
	import { UserRole, type Data } from '../../lib/model';
	import { GameKind, Message, MessageType, TeamGender } from '../../lib/model';
	import { game, messageStore, team, user } from '../../lib/stores';
	import { isEnterKeyEvent } from '../../lib/util';

	export let item: Data, edit: boolean, type: DataType;

	let path: string,
		name: string,
		navTarget: string,
		store: HttpStore<Data>,
		EnumType: typeof UserRole | typeof TeamGender | typeof GameKind,
		fields: Field[];

	switch (type) {
		case 'team':
			path = 'teams';
			name = 'Team';
			navTarget = 'teams';
			store = team;
			EnumType = TeamGender;
			fields = [
				{ id: 'trophy_id', name: 'Trophy-ID', type: 'number' },
				{ id: 'name', name: 'Name', type: 'string' },
				{ id: 'gender', name: 'Geschlecht', type: 'gender' }
			];
			break;
		case 'game':
			path = 'games';
			name = 'Spiel';
			navTarget = 'games';
			store = game;
			EnumType = GameKind;
			fields = [
				{ id: 'trophy_id', name: 'Trophy-ID', type: 'number' },
				{ id: 'name', name: 'Name', type: 'string' },
				{ id: 'kind', name: 'Punktart', type: 'kind' }
			];
			break;
		case 'user':
			path = 'users';
			name = 'Nutzer';
			navTarget = 'users';
			store = user;
			EnumType = UserRole;
			fields = [
				{ id: 'name', name: 'Name', type: 'string' },
				{ id: 'role', name: 'Rolle', type: 'role' },
				{ id: 'password', name: 'Passwort', type: 'string' }
			];
			break;
		default:
			break;
	}

	async function checkInput(): Promise<boolean> {
		// only proceed if all values are present
		if (
			fields
				.map((f) => item[f.id])
				.map((f) => f == undefined || f == '')
				.reduce((a, b) => a || b)
		) {
			messageStore.set(new Message(MessageType.Error, 'Bitte alle Werte angeben!'));
			return false;
		}
		return true;
	}

	async function save() {
		if (await checkInput()) {
			await store.put(`${path}/${item.id}`, undefined, {
				...item
			});

			messageStore.set(
				new Message(
					MessageType.Info,
					`Änderungen an ${name} ${item.name} wurden erfolgreich gespeichert.`
				)
			);
			edit = false;
		}
	}

	async function create() {
		if (await checkInput()) {
			await store.post(path, undefined, {
				...item
			});

			messageStore.set(
				new Message(MessageType.Info, `Team ${item.name} wurde erfolgreich angelegt.`)
			);
			goto('/' + navTarget);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (isEnterKeyEvent(event)) {
			create();
		}
	}
</script>

<svelte:window on:keydown={handleKeyDown} />
<div class="h-full">
	{#if edit}
		<h1 class="text-5xl font-extrabold text-center">{item.name} bearbeiten</h1>
	{:else if type == 'user'}
		<h1 class="text-5xl font-extrabold text-center">Neuer {name}</h1>
	{:else}
		<h1 class="text-5xl font-extrabold text-center">Neues {name}</h1>
	{/if}
	<div class="form-control w-full justify-center pt-10 pb-10">
		<div class="flex flex-row justify-evenly">
			{#each fields as f}
				<div>
					<label class="label" for={f.name}>
						<span class="label-text">{f.name}</span>
					</label>

					{#if f.type == 'gender' || f.type == 'kind' || f.type == 'role'}
						<select
							id={f.type}
							bind:value={item[f.type]}
							class="select select-bordered w-full max-w-xs "
						>
							{#each Object.values(EnumType) as value}
								<option {value}> {localize(value)} </option>
							{/each}
						</select>
					{:else if f.type == 'number'}
						<input
							id="trophy-id"
							bind:value={item[f.id]}
							placeholder={f.name}
							class="input input-bordered"
							type="number"
						/>
					{:else}
						<input
							id="trophy-id"
							bind:value={item[f.id]}
							placeholder={f.name}
							class="input input-bordered"
						/>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<div class="flex flex-row justify-evenly">
		<a href={`/${navTarget}`} class="btn btn-outline btn-error">Abbrechen</a>
		{#if edit}
			<button on:click={save} class="btn btn-outline btn-success">Speichern</button>
		{:else}
			<button on:click={create} class="btn btn-outline btn-success">Erstellen</button>{/if}
	</div>
</div>
