<script lang="ts">
	import { type DisplayName, type Link } from '$lib/model';
	import Fuse from 'fuse.js';
	import { goto } from '$app/navigation';
	import hotkeys from 'hotkeys-js';
	import type { LayoutProps } from './$types';
	import Loader from '$lib/components/blocks/Loader.svelte';

	let { data, children }: LayoutProps = $props();
	let { games, users, teams } = $derived(data);
	let switcherModalId = 'switcher-modal';
	type SwitcherItem = {
		displayName: DisplayName;
		link: Link;
		id: string;
		trophy_id: number;
		name: string;
	};

	let searchValue = $state('');
	let selectedIndex = $state(0);

	let mixedObjects = $derived.by(() =>
		// stick to Promise.all so the we resolve only when all three are done
		Promise.all([games, users, teams]).then(
			([games, users, teams]) =>
				[
					...teams.map((t) => ({ ...t, displayName: 'Team', link: '/teams' })),
					...games.map((g) => ({ ...g, displayName: 'Spiel', link: '/games' })),
					...users.map((u) => ({ ...u, displayName: 'Nutzer', link: '/users' }))
				] as SwitcherItem[]
		)
	);
	const options = {
		keys: ['name', 'trophy_id', 'type'],
		threshold: 0.3
	};
	let fuse = $derived.by(() => mixedObjects.then((o) => new Fuse(o, options)));
	let searchResults = $derived.by(async () => {
		if (searchValue != '') {
			// only display the first 10 results
			const f = await fuse;
			return f.search(searchValue).slice(0, 10);
		}
		return Promise.resolve([]);
	});

	hotkeys.filter = (_event) => true;
	hotkeys('ctrl+p,command+p,ctrl+space,esc,enter,up,down', (event, handler) => {
		event.preventDefault();

		switch (handler.key) {
			case 'ctrl+p':
			case 'ctrl+space':
			case 'command+p':
				// just default to the first item when opening, as users may have set a different index when the switcher was closed
				selectedIndex = 0;
				(document.getElementById(switcherModalId) as HTMLDialogElement).show();
				break;
			case 'esc':
				(document.getElementById(switcherModalId) as HTMLDialogElement).close();
				searchValue = '';
				break;
			case 'enter':
				let result = searchResults.then((results) => results[selectedIndex]);
				// reset the switcher after capturing the result
				(document.getElementById(switcherModalId) as HTMLDialogElement).close();
				searchValue = '';
				if (result) {
					result.then((r) => goto(`${r.item.link}/${r.item.id}`));
				}
				break;
			case 'up':
				if (selectedIndex == 0) {
					searchResults.then((results) => results.length).then((len) => (selectedIndex = len - 1));
				} else {
					selectedIndex--;
				}
				break;
			case 'down':
				searchResults.then((results) => {
					if (selectedIndex + 1 == results.length) {
						selectedIndex = 0;
					} else {
						selectedIndex++;
					}
				});
				break;
		}
	});

	// NOTE previously, we unbound hotkeys (using hotkeys.unbind()) on destroy.
	// This was flawed since it happened in messageStore.subscribe.
</script>

{@render children()}

<!-- NOTE focusing is extremely hacky - neither autofocus nor ontransitioned work on their own.
We focus the input initially using ontransitioned and keep focus with autofocus.
-->
<dialog
	class="modal"
	id={switcherModalId}
	ontransitionend={() => (document.getElementById('switcher-input') as HTMLInputElement).focus()}
>
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<form>
			<h1 class="font-bold text-xl text-center pb-2">Switcher</h1>

			{#await searchResults}
				<Loader></Loader>
			{:then results}
				<!-- svelte-ignore a11y_autofocus -->
				<input
					class="input input-bordered w-full mb-4"
					id="switcher-input"
					type="text"
					bind:value={searchValue}
					autofocus
				/>
				{#if searchValue != '' && results && results.length == 0}
					<p>
						Keine Treffer für '{searchValue}'.
					</p>
				{:else}
					<ul class="menu rounded-box w-full p-0 gap-1">
						{#each results as result}
							<li class="w-full">
								<a
									href={`${result.item.link}/${result.item.id}`}
									onclick={() => {
										(document.getElementById(switcherModalId) as HTMLDialogElement).close();
										searchValue = '';
									}}
									class="flex flex-row justify-between w-full font-bold"
									class:bg-primary={result.refIndex == results[selectedIndex].refIndex}
									class:text-white={result.refIndex == results[selectedIndex].refIndex}
								>
									<p>
										{result.item.name}
										{#if result.item.link !== '/users'}
											- {result.item.trophy_id}
										{/if}
									</p>
									<p>
										{result.item.displayName}
									</p>
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			{/await}
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
