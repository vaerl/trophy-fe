<script lang="ts">
	import { goto } from '$app/navigation';
	import { GameKind, MessageType, type CreateGame, type Game } from '$lib/model.js';
	import { messageStore } from '$lib/stores';
	import { getYear } from '$lib/util.js';
	import Cog from '../../../../components/icons/Cog.svelte';
	import Home from '../../../../components/icons/Home.svelte';
	import Info from '../../../../components/icons/Info.svelte';
	import LeftArrow from '../../../../components/icons/LeftArrow.svelte';
	import UserIcon from '../../../../components/icons/UserIcon.svelte';
	import LogoutButton from '../../../../components/LogoutButton.svelte';
	import Navbar from '../../../../components/Navbar.svelte';

	let { data } = $props();

	async function save(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);

		let trophy_id = form.get('trophy_id');
		let name = form.get('name');
		let kind = form.get('kind');
		let year = getYear();

		let game: CreateGame = {
			trophy_id: parseInt(trophy_id!.toString()),
			name: name!.toString(),
			kind: kind as GameKind,
			year: parseInt(year.toString())
		};

		const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
		let res = await fetch(`${baseUrl}/games/${data.game.id}`, {
			method: 'PUT',
			headers: {
				// requests won't work without this
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(game),
			credentials: 'include'
		});

		if (res.status != 200) {
			messageStore.set({
				type: MessageType.Error,
				message: `Etwas ist schiefgelaufen: ${await res.text()}`
			});
			return;
		}

		let gameRes: Game = await res.json();
		messageStore.set({
			type: MessageType.Success,
			message: `Änderungen an Spiel ${gameRes.name} wurde erfolgreich gespeichert.`
		});
		goto(`/games/${data.game.id}`);
	}
</script>

<div class="flex flex-col h-full">
	<Navbar title={`${data.game.name} bearbeiten`}>
		{#snippet left()}
			<a href="/settings"><Cog /></a>
			<a href="/overview/pie"><Home /></a>
			<a href={`/games/${data.game.id}`}><LeftArrow /></a>
		{/snippet}
		{#snippet right()}
			<a href="/users"> <UserIcon /> </a>
			<a href="/logs"> <Info /> </a>
			<LogoutButton></LogoutButton>
		{/snippet}
	</Navbar>

	<div class="w-full h-full flex justify-center items-center">
		<form class="flex flex-col w-80 gap-8" onsubmit={save}>
			<div class="w-full">
				<label class="label" for="trophy_id">
					<span class="label-text">Trophy-ID</span>
				</label>
				<input
					class="input input-bordered w-full"
					name="trophy_id"
					type="number"
					required
					min="1"
					value={data.game.trophy_id}
				/>
			</div>

			<div>
				<label class="label" for="name">
					<span class="label-text">Name</span>
				</label>
				<input
					class="input input-bordered w-full"
					name="name"
					type="text"
					required
					minlength="1"
					value={data.game.name}
				/>
			</div>

			<div>
				<label class="label" for="kind">
					<span class="label-text">Typ</span>
				</label>
				<select
					name="kind"
					class="select select-bordered w-full max-w-xs"
					required
					value={data.game.kind}
				>
					{#each Object.values(GameKind) as value}
						<option {value}> {value} </option>
					{/each}
				</select>
			</div>
			<button class="btn btn-primary w-full">Speichern</button>
		</form>
	</div>
</div>
