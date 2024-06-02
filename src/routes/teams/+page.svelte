<script lang="ts">
	import { goto } from '$app/navigation';
	import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables';

	export let data;
	const handler = new DataHandler(data.teams, { rowsPerPage: 50 });
	const rows = handler.getRows();
</script>

<h1 class="absolute-center-x left-1/2 text-4xl font-bold pt-6">Teams</h1>

<div style="height: calc(100% - 72px);">
	<Datatable {handler}>
		<table class="table table-zebra">
			<thead class="bg-white">
				<tr>
					<Th {handler} orderBy="trophy_id">Trophy-ID</Th>
					<Th {handler} orderBy="name">Name</Th>
					<Th {handler} orderBy="gender">Typ</Th>
					<Th {handler} orderBy="points">Punkte</Th>
				</tr>
				<tr>
					<ThFilter {handler} filterBy="trophy_id" />
					<ThFilter {handler} filterBy="name" />
					<ThFilter {handler} filterBy="gender" />
					<ThFilter {handler} filterBy="points" />
				</tr>
			</thead>

			<tbody>
				{#each $rows as row}
					<!-- even though I'd like to use <a>, only this will make sure the entire row is clickable -->
					<tr on:click={() => goto(`/teams/${row.id}`)} class="cursor-pointer">
						<td>
							{row.trophy_id}
						</td>
						<td>{row.name}</td>
						<td>{row.gender}</td>
						<td>{row.points}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</Datatable>
</div>
