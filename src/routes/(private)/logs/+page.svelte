<script lang="ts">
	import { SubjectType } from '$lib/model.js';
	import { TableHandler, Datatable, Th, ThFilter } from '@vincjo/datatables';
	import type { PageProps } from './$types';
	import Loader from '$lib/components/blocks/Loader.svelte';
	import ThSort from '$lib/components/table/ThSort.svelte';
	import LogoutButton from '$lib/components/blocks/LogoutButton.svelte';
	import Navbar from '$lib/components/blocks/Navbar.svelte';
	import Cog from '$lib/components/icons/Cog.svelte';
	import Home from '$lib/components/icons/Home.svelte';
	import UserIcon from '$lib/components/icons/UserIcon.svelte';

	let { data }: PageProps = $props();

	const table = data.logs.then((logs) => new TableHandler(logs, { rowsPerPage: 30 }));
</script>

<div class="w-full h-full flex flex-col">
	<Navbar title="Logs">
		{#snippet left()}
			<a href="/settings"><Cog /></a>
			<a href="/overview/pie"><Home /></a>
		{/snippet}
		{#snippet right()}
			<a href="/users"> <UserIcon /> </a>
			<LogoutButton></LogoutButton>
		{/snippet}
	</Navbar>

	{#await table}
		<div class="flex grow justify-center items-center">
			<Loader></Loader>
		</div>
	{:then table}
		<Datatable {table}>
			<table class="table table-zebra">
				<thead class="bg-white">
					<tr>
						<ThSort {table} field="id" isActive={true}>ID</ThSort>
						<ThSort {table} field="level">Level</ThSort>
						<ThSort {table} field="timestamp">Timestamp</ThSort>
						<ThSort {table} field="user_name">Nutzer</ThSort>
						<ThSort {table} field="operation">Operation</ThSort>
						<ThSort {table} field="subject_id">Subjekt</ThSort>
					</tr>
					<tr>
						<ThFilter {table} field="id" />
						<ThFilter {table} field="level" />
						<ThFilter {table} field="timestamp" />
						<ThFilter {table} field="user_name" />
						<ThFilter {table} field="operation" />
						<ThFilter {table} field="subject_id" />
					</tr>
				</thead>

				<tbody>
					{#each table.rows as row}
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
		<div class="w-full flex flex-row gap-2 justify-end p-4">
			<button
				class="btn"
				class:btn-disabled={table.currentPage == 1}
				onclick={() => table.setPage('previous')}>Zurück</button
			>
			{#each table.pagesWithEllipsis as page}
				<button
					type="button"
					class="btn"
					class:btn-primary={page === table.currentPage}
					onclick={() => table.setPage(page)}
				>
					{page ?? '...'}
				</button>
			{/each}

			<button
				class="btn"
				class:btn-disabled={table.currentPage == table.pageCount}
				onclick={() => table.setPage('next')}>Weiter</button
			>
		</div>
	{/await}
</div>
