<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Datatable, TableHandler, ThFilter, type Field } from '@vincjo/datatables';
	import { isTeam, type Game, type Team } from '$lib/model';
	import Cog from '../icons/Cog.svelte';
	import Home from '../icons/Home.svelte';
	import Info from '../icons/Info.svelte';
	import Plus from '../icons/Plus.svelte';
	import ThSort from './ThSort.svelte';
	import Loader from '../blocks/Loader.svelte';
	import LogoutButton from '../blocks/LogoutButton.svelte';
	import Navbar from '../blocks/Navbar.svelte';
	import UserIcon from '../icons/UserIcon.svelte';

	let { items }: { items: Promise<Team[]> | Promise<Game[]> } = $props();

	// since the type-guard returns a type predicate, we have to explicitly use a variable
	let routeIncludesTeams = page.route.id?.includes('teams') ?? true;
	let linkPrefix = routeIncludesTeams ? 'teams' : 'games';
	let typeName = routeIncludesTeams ? 'Team' : 'Spiel';

	const table = $derived.by(
		async () => new TableHandler<Team | Game>(await items, { rowsPerPage: 100 })
	);

	let isCtrlDown = false,
		isCDown = false,
		isShiftDown = false;

	// TODO can this be generalized?
	async function keyDown(event: KeyboardEvent): Promise<void> {
		event.preventDefault();

		if (event.repeat) {
			return;
		}

		switch (event.key) {
			case 'Control':
				isCtrlDown = true;
				break;
			case 'Shift':
				isShiftDown = true;
				break;
			case 'C':
				isCDown = true;
				break;
		}

		if (isCtrlDown && isCDown && isShiftDown) {
			goto(`/${await linkPrefix}/create`);
		}
	}

	function keyUp(event: KeyboardEvent): void {
		event.preventDefault();
		switch (event.key) {
			case 'Control':
				isCtrlDown = false;
				break;
			case 'Shift':
				isShiftDown = false;
				break;
			case 'C':
				isCDown = false;
				break;
		}
	}
</script>

<svelte:window onkeydown={keyDown} onkeyup={keyUp} />

<div class="flex flex-col h-full">
	<Navbar title={typeName}>
		{#snippet left()}
			<a href="/settings"><Cog /></a>
			<a href="/overview/pie"><Home /></a>
		{/snippet}
		{#snippet right()}
			{#await linkPrefix}
				<Loader></Loader>
			{:then linkPrefix}
				<a href={`/${linkPrefix}/create`}> <Plus /> </a>
			{/await}
			<a href="/users"> <UserIcon /> </a>
			<a href="/logs"> <Info /> </a>
			<LogoutButton></LogoutButton>
		{/snippet}
	</Navbar>
	{#await Promise.all([table, routeIncludesTeams, linkPrefix])}
		<div class="flex justify-center flex-grow">
			<Loader></Loader>
		</div>
	{:then [table, itemsAreTeams, linkPrefix]}
		<div class="overflow-scroll">
			<Datatable {table}>
				<table>
					<thead>
						<tr id="items-table-header">
							<ThSort {table} field="trophy_id" isActive={true}>Trophy-ID</ThSort>
							<ThSort {table} field="name">Name</ThSort>
							{#if itemsAreTeams}
								<ThSort {table} field={'gender' as Field<Team>}>Typ</ThSort>
								<ThSort {table} field={'points' as Field<Team>}>Punkte</ThSort>
							{:else}
								<ThFilter {table} field={'kind' as Field<Game>} />
							{/if}
						</tr>
						<tr>
							<ThFilter {table} field="trophy_id" />
							<ThFilter {table} field="name" />
							{#if itemsAreTeams}
								<ThFilter {table} field={'gender' as Field<Team>} />
								<ThFilter {table} field={'points' as Field<Team>} />
							{:else}
								<ThFilter {table} field={'kind' as Field<Game>} />
							{/if}
						</tr>
					</thead>

					<tbody>
						{#each table.rows as row}
							<!-- even though I'd like to use <a>, only this will make sure the entire row is clickable -->
							<tr onclick={() => goto(`/${linkPrefix}/${row.id}`)} class="cursor-pointer">
								<td>
									{row.trophy_id}
								</td>
								<td>{row.name}</td>
								{#if isTeam(row)}
									<td>{row.gender}</td>
									<td>{row.points}</td>
								{:else}
									<td>{row.kind}</td>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			</Datatable>
		</div>
	{/await}
</div>
