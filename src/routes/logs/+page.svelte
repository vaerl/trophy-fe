<script lang="ts">
	import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables';

	export let data;

	const handler = new DataHandler(data.logs, { rowsPerPage: 50 });
	handler.applySort({ orderBy: 'id', direction: 'desc' });
	const rows = handler.getRows();
</script>

<h1 class="absolute-center-x left-1/2 text-4xl font-bold pt-6">Logs</h1>

<!-- we need to subtract the header from the table's height -->
<div style="height: calc(100% - 72px);">
	<Datatable {handler}>
		<table class="table table-zebra">
			<thead class="bg-white">
				<tr>
					<Th {handler} orderBy="id">ID</Th>
					<Th {handler} orderBy="log_level">Level</Th>
					<Th {handler} orderBy="timestamp">Timestamp</Th>
					<Th {handler} orderBy="user_name">Nutzer</Th>
					<Th {handler} orderBy="action">Aktion</Th>
				</tr>
				<tr>
					<ThFilter {handler} filterBy="id" />
					<ThFilter {handler} filterBy="log_level" />
					<ThFilter {handler} filterBy="timestamp" />
					<ThFilter {handler} filterBy="user_name" />
					<ThFilter {handler} filterBy="action" />
				</tr>
			</thead>

			<tbody>
				{#each $rows as row}
					<tr>
						<td>{row.id}</td>
						<td>{row.log_level}</td>
						<td>{new Date(row.timestamp).toLocaleString('de-DE')}</td>
						<td>{row.user_name}</td>
						<td>{row.action}</td>
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
