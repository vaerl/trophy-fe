<script lang="ts">
	import { goto } from '$app/navigation';
	import { Datatable, TableHandler, Th, ThFilter } from '@vincjo/datatables';

	let { data } = $props();
	const table= new TableHandler(data.games, { rowsPerPage: 20 });
	let sort = table.createSort('trophy_id')
	sort.isActive = true;
	
	let isCtrlDown = false,
		isCDown = false,
		isShiftDown = false;

	function keyDown(event: any) {
		if (event.repeat) {
			return;
		}

		switch (event.key) {
			case 'Control':
				event.preventDefault();
				isCtrlDown = true;
				break;
			case 'Shift':
				event.preventDefault();
				isShiftDown = true;
				break;
			case 'C':
				event.preventDefault();
				isCDown = true;
				break;
		}

		if (isCtrlDown && isCDown && isShiftDown) {
			goto('/teams/create');
		}
	}

	function keyUp(event: any) {
		// `keyup` is the reverse, it fires whenever the physical key was let.
		// go after being held down

		// Just like our `keydown` handler, we need to update the boolean
		// flags, but in the opposite direction.
		switch (event.key) {
			case 'Control':
				isCtrlDown = false;
				event.preventDefault();
				break;
			case 'Shift':
				isShiftDown = false;
				event.preventDefault();
				break;
			case 'C':
				isCDown = false;
				event.preventDefault();
				break;
		}
	}
</script>

<svelte:window onkeydown={keyDown} onkeyup={keyUp} />

<h1 class="absolute-center-x left-1/2 text-4xl font-bold pt-6">Spiele</h1>
<div style="height: calc(100% - 72px);">
	<Datatable {table}>
		<table class="table table-zebra">
			<thead class="bg-white">
				<tr>
					<Th {table} orderBy="trophy_id">Trophy-ID</Th>
					<Th {table} orderBy="name">Name</Th>
					<Th {table} orderBy="kind">Typ</Th>
				</tr>
				<tr>
					<ThFilter {table} filterBy="trophy_id" />
					<ThFilter {table} filterBy="name" />
					<ThFilter {table} filterBy="kind" />
				</tr>
			</thead>

			<tbody>
				{#each table.rows as row}
					<!-- even though I'd like to use <a>, only this will make sure the entire row is clickable -->
					<tr onclick={() => goto(`/games/${row.id}`)} class="cursor-pointer">
						<td>
							{row.trophy_id}
						</td>
						<td>{row.name}</td>
						<td>{row.kind}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</Datatable>
</div>
