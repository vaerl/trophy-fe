<script lang="ts">
	import { TableHandler, Datatable, ThFilter, ThSort } from '@vincjo/datatables';
	import { goto } from '$app/navigation';
	import Navbar from '$lib/components/blocks/Navbar.svelte';
	import Loader from '$lib/components/blocks/Loader.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	// keep this at 50 if we ever add referee-users
	const table = $derived.by(async () => {
		const users = await data.users;
		return new TableHandler(users, { rowsPerPage: 50 });
	});

	let isCtrlDown = false,
		isCDown = false,
		isShiftDown = false;

	function keyDown(event: KeyboardEvent) {
		event.preventDefault();
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
			goto('/users/create');
		}
	}

	function keyUp(event: KeyboardEvent) {
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

<div class="w-full h-full flex flex-col">
	<Navbar title="Nutzer" />

	{#await table}
		<div class="flex grow justify-center items-center">
			<Loader></Loader>
		</div>
	{:then table}
		<Datatable {table}>
			<table>
				<thead>
					<tr>
						<ThSort {table} field="id" direction="asc">ID</ThSort>
						<ThSort {table} field="name">Name</ThSort>
						<ThSort {table} field="role">Rolle</ThSort>
						<ThSort {table} field="game_name">Spiel</ThSort>
					</tr>
					<tr>
						<ThFilter {table} field="id" />
						<ThFilter {table} field="name" />
						<ThFilter {table} field="role" />
						<ThFilter {table} field="game_name" />
					</tr>
				</thead>

				<tbody>
					{#each table.rows as row}
						<tr onclick={() => goto(`/users/${row.id}`)} class="cursor-pointer">
							<td>{row.id}</td>
							<td>{row.name}</td>
							<td>{row.role}</td>
							<td>{row.game_name ?? 'Kein Spiel'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</Datatable>
	{/await}
</div>
