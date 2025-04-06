<script lang="ts">
	import { goto } from '$app/navigation';
	import { Datatable, TableHandler, ThFilter, ThSort, type Field } from '@vincjo/datatables';
	import { areTeams, isTeam, type Game, type Team } from '$lib/model';
	import Cog from './icons/Cog.svelte';
	import Home from './icons/Home.svelte';
	import Info from './icons/Info.svelte';
	import Plus from './icons/Plus.svelte';
	import UserIcon from './icons/UserIcon.svelte';
	import LogoutButton from './LogoutButton.svelte';
	import Navbar from './Navbar.svelte';

	type Props = { items: Team[] | Game[] };
	let { items }: Props = $props();
	// since the type-guard returns a type predicate, we have to explicitly use a variable
	let itemsAreTeams = areTeams(items);
	let linkPrefix = itemsAreTeams ? 'teams' : 'games';
	let typeName = itemsAreTeams ? 'Team' : 'Spiel';

	const table = new TableHandler<Team | Game>(items, { rowsPerPage: 100 });
	let sort = table.createSort('trophy_id');
	sort.isActive = true;

	let isCtrlDown = false,
		isCDown = false,
		isShiftDown = false;

	function keyDown(event: KeyboardEvent): void {
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
			goto(`/${linkPrefix}/create`);
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
			<a href={`/${linkPrefix}/create`}> <Plus /> </a>
			<a href="/users"> <UserIcon /> </a>
			<a href="/logs"> <Info /> </a>
			<LogoutButton></LogoutButton>
		{/snippet}
	</Navbar>

	<div class="overflow-scroll">
		<Datatable {table}>
			<table>
				<thead class="bg-white!">
					<tr>
						<ThSort {table} field="trophy_id">Trophy-ID</ThSort>
						<ThSort {table} field="name">Name</ThSort>
						{#if areTeams(items)}
							<ThSort {table} field={'gender' as Field<Team>}>Typ</ThSort>
							<ThSort {table} field={'points' as Field<Team>}>Punkte</ThSort>
						{:else}
							<ThFilter {table} field={'kind' as Field<Game>} />
						{/if}
					</tr>
					<tr>
						<ThFilter {table} field="trophy_id" />
						<ThFilter {table} field="name" />
						{#if areTeams(items)}
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
</div>
