<script lang="ts">
	import { SubjectType } from '$lib/model.js';
	import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables';

	let { data } = $props();

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
					<Th {handler} orderBy="level">Level</Th>
					<Th {handler} orderBy="timestamp">Timestamp</Th>
					<Th {handler} orderBy="user_name">Nutzer</Th>
					<Th {handler} orderBy="operation">Operation</Th>
					<Th {handler} orderBy="subject_id">Subjekt</Th>
				</tr>
				<tr>
					<ThFilter {handler} filterBy="id" />
					<ThFilter {handler} filterBy="level" />
					<ThFilter {handler} filterBy="timestamp" />
					<ThFilter {handler} filterBy="user_name" />
					<ThFilter {handler} filterBy="operation" />
					<ThFilter {handler} filterBy="subject_id" />
				</tr>
			</thead>

			<tbody>
				{#each $rows as row}
					<tr>
						<td>{row.id}</td>
						<td>{row.level}</td>
						<td>{new Date(row.timestamp).toLocaleString('de-DE')}</td>
						<td>
							{#if row.user_id}
								<a href={`/users/${row.user_id}`} class="link">{row.user_name}</a>
							{:else}
								<p>Kein Nutzer</p>
							{/if}
						</td>
						<td>
							{row.operation}
						</td>
						<!-- TODO this could use some nicer linking at some point -->
						<td>
							{#if row.subject_id && (row.subject_type == SubjectType.Game || row.subject_type == SubjectType.Team || row.subject_type == SubjectType.User)}
								<a href={`/${row.subject_type}s/${row.subject_id}`} class="link"
									>{row.subject_type} {row.subject_id}</a
								>
							{:else}
								{row.subject_type}
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</Datatable>
</div>
