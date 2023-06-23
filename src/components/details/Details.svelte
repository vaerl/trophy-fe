<script lang="ts">
	import type { Column, DataType } from '../../lib/data';
	import { Message, MessageType, type Data } from '../../lib/model';
	import { messageStore, team, game, outcomes, user } from '../../lib/stores';
	import Loader from '../../components/Loader.svelte';
	import OutcomeTable from '../../components/details/OutcomeTable.svelte';
	import type { HttpStore } from '../../lib/httpStore';
	import Create from './Create.svelte';
	import Breadcrumbs from '../Breadcrumbs.svelte';
	import Delete from '../icons/Delete.svelte';
	import Edit from '../icons/Edit.svelte';
	import { localize } from '../../lib/localize';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let type: DataType;
	export let columns: Column[];

	// TODO item should not stay any
	let path: string, name: string, namePlural: string, item: HttpStore<any>;

	switch (type) {
		case 'team':
			path = 'teams';
			name = 'Team';
			namePlural = 'Teams';
			item = team;
			break;
		case 'game':
			path = 'games';
			name = 'Spiel';
			namePlural = 'Spiele';
			item = game;
			break;
		case 'user':
			path = 'users';
			name = 'Nutzer';
			namePlural = 'Nutzer';
			item = user;
			break;
		default:
			console.error('Find unsupported type: ', type);
			break;
	}

	let id: number = parseInt($page.params.id);
	let edit = false;
	let modalOpen = false;

	function loadData() {
		item.get(`${path}/${id}`);
		if (type != 'user') {
			outcomes.get(`outcomes/${path}/${id}`);
		}
	}

	$: itemLoading = item.loading;
	// if the value of modalOpen has changed, load the data -> this indicates that an outcome might have been added from OutcomeEdit
	$: {
		modalOpen;
		loadData();
	}

	async function deleteItem() {
		await item.delete(`${path}/${id}`);
		messageStore.set(new Message(MessageType.Info, `${name} erfolgreich gelöscht.`));
		goto(`/${path}`);
	}

	loadData();
</script>

<Breadcrumbs current="Details" paths={[{ name: namePlural, path: `/${path}` }]} />

{#if $itemLoading}
	<Loader />
{:else if edit}
	<Create bind:edit item={$item} {type} />
{:else}
	<div class="flex flex-row justify-center w-full">
		<h1 class="text-5xl font-extrabold">{$item.name}</h1>

		<div class="gap-4 absolute right-2">
			<button on:click={() => (edit = !edit)} class="btn btn-circle"><Edit /></button>
			<button on:click={deleteItem} class="btn btn-circle">
				<Delete />
			</button>
		</div>
	</div>

	<div class="flex flex-row justify-around py-10">
		{#each columns as col}
			<h3>{col.name}: {localize($item[col.id])}</h3>
		{/each}
	</div>
	{#if type != 'user'}
		<div class="divider" />

		<div class="flex flex-row justify-around">
			<OutcomeTable status="open" {type} />

			<div class="divider divider-vertical" />

			<OutcomeTable status="done" {type} />
		</div>
	{/if}
{/if}
