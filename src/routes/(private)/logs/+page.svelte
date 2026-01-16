<script lang="ts">
	import { LogLevel, SubjectType } from '$lib/model.js';
	import { TableHandler, Datatable, ThFilter, ThSort } from '@vincjo/datatables';
	import type { PageProps } from './$types';
	import Loader from '$lib/components/blocks/Loader.svelte';
	import Navbar from '$lib/components/blocks/Navbar.svelte';

	let { data }: PageProps = $props();

	let table = $derived.by(async () => new TableHandler(await data.logs, { rowsPerPage: 30 }));
	const filter = $derived.by(async () => {
		const filter = (await table).createAdvancedFilter('level');
		// initialize the filter with Info and Warn
		filter.set(LogLevel.Info);
		filter.set(LogLevel.Warn);
		return filter;
	});
</script>

<div class="w-full h-full flex flex-col">
	<Navbar title="Logs" />

	{#await Promise.all([table, filter])}
		<div class="flex grow justify-center items-center">
			<Loader></Loader>
		</div>
	{:then [table, filter]}
		<div class="w-full flex flex-row justify-end">
			<div class="flex flex-row gap-2">
				<button
					onclick={() => filter.set(LogLevel.Warn)}
					class="badge cursor-pointer badge-warning"
					class:badge-soft={!filter.criteria.includes(LogLevel.Warn)}>Warn</button
				>
				<button
					onclick={() => filter.set(LogLevel.Info)}
					class="badge badge-info cursor-pointer"
					class:badge-soft={!filter.criteria.includes(LogLevel.Info)}>Info</button
				>
				<button
					onclick={() => filter.set(LogLevel.Debug)}
					class="badge badge-secondary cursor-pointer"
					class:badge-soft={!filter.criteria.includes(LogLevel.Debug)}>Debug</button
				>
			</div>
		</div>
		<Datatable {table}>
			<table>
				<thead>
					<tr>
						<ThSort {table} field="id" direction="desc">ID</ThSort>
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
