<script lang="ts">
	import { searchValue, teams } from '../../lib/stores';
	import Search from '../../components/table/Search.svelte';
	import Loader from '../../components/Loader.svelte';
	import Check from '../../components/icons/Check.svelte';
	import Cross from '../../components/icons/Cross.svelte';
	import type { Writable } from 'svelte/store';
	import Plus from '../icons/Plus.svelte';
	import type { Column, DataType } from '../../lib/data';
	import RightArrow from '../icons/RightArrow.svelte';
	import type { Data } from '../../lib/model';
	import { localize } from '../../lib/localize';
	import SortableHeader from './SortableHeader.svelte';
	import type { HttpStore } from '$lib/httpStore';

	type temp = $$Generic;
	type T = temp & Data;
	export let items: HttpStore<T[]>;
	export let pendingItems: Writable<T[]>;
	export let itemsLoading: Writable<boolean>;
	export let pendingItemsLoading: Writable<boolean>;
	export let columns: Column[];

	export let type: DataType;

	let path: string,
		name: string,
		namePlural: string,
		showStatus: boolean,
		showDetails: boolean,
		noItemsText: string;

	switch (type) {
		case 'game':
			path = 'games';
			name = 'Spiel';
			namePlural = 'Spiele';
			showStatus = true;
			showDetails = true;
			noItemsText = 'Keine Spiele angelegt.';
			break;
		case 'team':
			path = 'teams';
			name = 'Team';
			namePlural = 'Teams';
			showStatus = true;
			showDetails = true;
			noItemsText = 'Keine Teams angelegt.';
			break;
		case 'user':
			path = 'users';
			name = 'Nutzer';
			namePlural = 'Nutzer';
			showStatus = false;
			showDetails = true;
			noItemsText = 'Keine Nutzer angelegt.';
			break;
		default:
			break;
	}

	let itemsSubset: T[] = [];
	let sortBy = { col: columns[0].id, ascending: true };

	// if data or value changes, we filter again
	$: {
		// the undefined check is necessary, because loading items might complete after rendering the page
		if ($items != undefined && $items.length == 0) {
			noItemsText = `Momentan sind keine ${namePlural} angelegt.`;
		} else if ($searchValue === '') {
			itemsSubset = $items;
		} else if ($teams) {
			itemsSubset = $items.filter((e) =>
				columns
					.map((c) => e[c.id])
					// this stream might contain numbers
					.map((f) => String(f))
					// translate all enums
					.map((f) => localize(f))
					// make sure everything is in lowercase for comparison
					.map((f) => f.toLowerCase())
					.map((f) => f.includes($searchValue.toLowerCase()))
					.some((f) => f == true)
			);

			if (itemsSubset.length == 0) {
				noItemsText = `Keine ${namePlural} für "{$searchValue} gefunden."`;
			}
		}
	}

	$: sort = (column: string) => {
		if (sortBy.col == column) {
			sortBy.ascending = !sortBy.ascending;
		} else {
			sortBy.col = column;
			sortBy.ascending = true;
		}

		// modifier to sorting function for ascending or descending
		let sortModifier = sortBy.ascending ? 1 : -1;

		let sort = (a: T, b: T) =>
			a[column] < b[column] ? -1 * sortModifier : a[column] > b[column] ? 1 * sortModifier : 0;

		itemsSubset = itemsSubset.sort(sort);
	};

	async function deleteItem(id: number) {
		await items.delete(`${path}/${id}`);
		await items.get(`${path}`);
	}
</script>

{#if $itemsLoading || $pendingItemsLoading}
	<Loader />
{:else}
	<div class="flex flex-row justify-center pt-4 pb-4 items-center">
		<div class="w-1/3">
			<Search />
		</div>
		<Plus basePath={path} />
	</div>
	{#if $items.length > 0}
		<table class="table table-zebra w-full">
			<thead>
				<tr>
					{#each columns as col}
						<th on:click={() => sort(col.id)}>
							<SortableHeader
								name={col.name}
								show={sortBy.col == col.id}
								ascending={sortBy.ascending}
							/>
						</th>
					{/each}
					{#if showStatus}
						<th on:click={() => sort('status')}>
							<SortableHeader
								name="Status"
								show={sortBy.col == 'status'}
								ascending={sortBy.ascending}
							/></th
						>
					{/if}
					{#if showDetails}
						<th />
					{/if}
				</tr>
			</thead>
			<tbody class="w-full">
				{#each itemsSubset as item}
					<tr>
						{#each columns as col}
							<td>{localize(item[col.id])}</td>
						{/each}
						{#if showStatus}
							<td
								>{#if $pendingItems.find((t) => t.id == item.id)}
									<Cross />
								{:else}
									<Check />
								{/if}
							</td>
						{/if}
						{#if showDetails}
							<td>
								<a href={`${path}/${item.id}`} class="link"
									><div class="flex flex-row items-center">
										<p>Details</p>
										<RightArrow />
									</div>
								</a>
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<h1 class="font-extrabold text-center text-3xl mt-20">
			{noItemsText}
		</h1>
	{/if}
{/if}
