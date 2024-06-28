<script lang="ts">
	import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables';
	import { goto } from '$app/navigation';

	export let data;
	// keep this at 50 if we ever add referee-users
	const handler = new DataHandler(data.users, { rowsPerPage: 50 });
	const rows = handler.getRows();

	function keyDown(event: any) {
		event.preventDefault();
		switch (event.key) {
			case 'n':
				goto('/users/create');
				break;
		}
	}
</script>

<svelte:window on:keydown={keyDown} />

<h1 class="absolute-center-x left-1/2 text-4xl font-bold pt-6">Nutzer</h1>

<div style="height: calc(100% - 72px);">
	<Datatable {handler}>
		<table class="table table-zebra">
			<thead class="bg-white">
				<tr>
					<Th {handler} orderBy="id">ID</Th>
					<Th {handler} orderBy="name">Name</Th>
					<Th {handler} orderBy="role">Rolle</Th>
					<Th {handler} orderBy="game_name">Spiel</Th>
				</tr>
				<tr>
					<ThFilter {handler} filterBy="id" />
					<ThFilter {handler} filterBy="name" />
					<ThFilter {handler} filterBy="role" />
					<ThFilter {handler} filterBy="game_name" />
				</tr>
			</thead>

			<tbody>
				{#each $rows as row}
					<tr on:click={() => goto(`/users/${row.id}`)} class="cursor-pointer">
						<td>{row.id}</td>
						<td>{row.name}</td>
						<td>{row.role}</td>
						<td>{row.game_name}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</Datatable>
</div>

<style>
	tbody td {
		border: 1px solid #f5f5f5;
		padding: 4px 20px;
	}
	tbody tr {
		transition: all, 0.2s;
	}
	tbody tr:hover {
		background: #f5f5f5;
	}
</style>
