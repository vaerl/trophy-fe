<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Datatable, TableHandler, ThFilter, ThSort, type Field } from '@vincjo/datatables';
	import { isTeam, type Game, type Team } from '$lib/model';
	import Plus from '../icons/Plus.svelte';
	import Loader from '../blocks/Loader.svelte';
	import Navbar from '../blocks/Navbar.svelte';

	let { items }: { items: Promise<Team[]> | Promise<Game[]> } = $props();

	const routeIncludesTeams = page.route.id?.includes('teams') ?? true;
	const linkPrefix = routeIncludesTeams ? 'teams' : 'games';
	const typeName = routeIncludesTeams ? 'Team' : 'Spiel';

	const table = $derived.by(
		async () => new TableHandler<Team | Game>(await items, { rowsPerPage: 100 })
	);

	let isCtrlDown = false,
		isCDown = false,
		isShiftDown = false;

	async function keyDown(event: KeyboardEvent): Promise<void> {
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

<div class="flex flex-col h-full w-full">
	<Navbar title={typeName}>
		{#snippet right()}
			<a href={`/${linkPrefix}/create`}> <Plus /> </a>
		{/snippet}
	</Navbar>
	{#await table}
		<div class="flex justify-center grow">
			<Loader></Loader>
		</div>
	{:then table}
		<Datatable basic {table}>
			<table>
				<thead>
					<tr>
						<ThSort {table} field="trophy_id" direction="asc">Trophy-ID</ThSort>
						<ThSort {table} field="name">Name</ThSort>
						{#if routeIncludesTeams}
							<ThSort {table} field={'gender' as Field<Team>}>Typ</ThSort>
							<ThSort {table} field={'points' as Field<Team>}>Punkte</ThSort>
						{:else}
							<ThSort {table} field={'kind' as Field<Game>}>Punktart</ThSort>
						{/if}
					</tr>
					<tr>
						<ThFilter {table} field="trophy_id" />
						<ThFilter {table} field="name" />
						{#if routeIncludesTeams}
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
							<!-- using isTeam gives us the type-assertion -->
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
	{/await}
</div>
