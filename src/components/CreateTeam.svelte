<script lang="ts">
	import { goto } from '$app/navigation';
	import { MessageType, TeamGender, type CreateTeam, type Team } from '$lib/model.js';
	import { messageStore } from '$lib/stores';
	import { getYear } from '$lib/util.js';
	import Loader from './blocks/Loader.svelte';
	import LogoutButton from './blocks/LogoutButton.svelte';
	import Navbar from './blocks/Navbar.svelte';
	import Cog from './icons/Cog.svelte';
	import Home from './icons/Home.svelte';
	import Info from './icons/Info.svelte';
	import LeftArrow from './icons/LeftArrow.svelte';
	import UserIcon from './icons/UserIcon.svelte';

	let { team }: { team?: Promise<Team> } = $props();
	let isLoading = $state(false);

	/**
	 * Updates or creates, depending on whether {@code team} is present.
	 * Also handles loading.
	 * @param event the SubmitEvent that triggered this call
	 * @param team the current team, may be undefined
	 */
	async function save(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
		team?: Team
	) {
		isLoading = true;
		event.preventDefault();
		const form = new FormData(event.currentTarget);

		let trophy_id = form.get('trophy_id');
		let name = form.get('name');
		let gender = form.get('gender');
		let year = getYear();

		let updatedGame: CreateTeam = {
			trophy_id: parseInt(trophy_id!.toString().trim()),
			name: name!.toString().trim(),
			gender: gender as TeamGender,
			year: parseInt(year.toString())
		};

		const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
		let res;

		if (team) {
			res = await fetch(`${baseUrl}/teams/${team.id}`, {
				method: 'PUT',
				headers: {
					// requests won't work without this
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(team),
				credentials: 'include'
			});
		} else {
			res = await fetch(`${baseUrl}/teams`, {
				method: 'POST',
				headers: {
					// requests won't work without this
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify(team)
			});
		}

		if (res.status != 200) {
			messageStore.set({
				type: MessageType.Error,
				message: `Etwas ist schiefgelaufen: ${await res.text()}`
			});
			return;
		}

		let teamRes: Team = await res.json();
		if (team) {
			messageStore.set({
				type: MessageType.Success,
				message: `Änderungen an Team ${teamRes.name} wurde erfolgreich gespeichert.`
			});
			await goto(`/teams/${teamRes.id}`);
		} else {
			messageStore.set({
				type: MessageType.Success,
				message: `Team ${teamRes.name} wurde erfolgreich angelegt.`
			});
			await goto(`/teams/${teamRes.id}`);
		}

		isLoading = false;
	}
</script>

<div class="flex flex-col h-full">
	{#await team}
		<Navbar>
			{#snippet left()}
				<a href="/settings"><Cog /></a>
				<a href="/overview/pie"><Home /></a>
				<a href="/teams"><LeftArrow /></a>
			{/snippet}
			{#snippet right()}
				<a href="/users"> <UserIcon /> </a>
				<a href="/logs"> <Info /> </a>
				<LogoutButton></LogoutButton>
			{/snippet}
		</Navbar>
		<div class="w-full h-full flex justify-center items-center">
			<Loader></Loader>
		</div>
	{:then team}
		<Navbar title={team ? `${team.name} bearbeiten` : 'Neues Team anlegen'}>
			{#snippet left()}
				<a href="/settings"><Cog /></a>
				<a href="/overview/pie"><Home /></a>
				{#if team}
					<a href={`/teams/${team.id}`}><LeftArrow /></a>
				{:else}
					<a href="/teams"><LeftArrow /></a>
				{/if}
			{/snippet}
			{#snippet right()}
				<a href="/users"> <UserIcon /> </a>
				<a href="/logs"> <Info /> </a>
				<LogoutButton></LogoutButton>
			{/snippet}
		</Navbar>

		<div class="w-full h-full flex justify-center items-center">
			{#if isLoading}
				<Loader></Loader>
			{:else}
				<form class="flex flex-col w-80 gap-8" onsubmit={(event) => save(event, team)}>
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
							value={team?.trophy_id}
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
							value={team?.name}
						/>
					</div>

					<div>
						<label class="label" for="gender">
							<span class="label-text">Typ</span>
						</label>
						<select
							name="gender"
							class="select select-bordered w-full max-w-xs"
							required
							value={team?.gender}
						>
							{#each Object.values(TeamGender) as value}
								<option {value}> {value} </option>
							{/each}
						</select>
					</div>
					<button class="btn btn-primary w-full">Speichern</button>
				</form>
			{/if}
		</div>
	{/await}
</div>
