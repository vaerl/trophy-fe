<script lang="ts">
	import { goto } from '$app/navigation';
	import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables';

	export let data;
	const handler = new DataHandler(data.games, { rowsPerPage: 10 });
	const rows = handler.getRows();
</script>

<h1 class="absolute-center-x left-1/2 text-4xl font-bold pt-6">Spiele</h1>

<Datatable {handler}>
	<table class="table table-zebra">
		<thead>
			<tr>
				<Th {handler} orderBy="trophy_id">Trophy-ID</Th>
				<Th {handler} orderBy="name">Name</Th>
				<Th {handler} orderBy="kind">Typ</Th>
			</tr>
			<tr>
				<ThFilter {handler} filterBy="trophy_id" />
				<ThFilter {handler} filterBy="name" />
				<ThFilter {handler} filterBy="kind" />
			</tr>
		</thead>

		<tbody>
			{#each $rows as row}
				<!-- even though I'd like to use <a>, only this will make sure the entire row is clickable -->
				<tr on:click={() => goto(`/games/${row.id}`)} class="cursor-pointer">
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
