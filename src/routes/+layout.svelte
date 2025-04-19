<script lang="ts">
	import '../app.css';
	import { messageStore } from '$lib/stores';
	import { onDestroy, type Snippet } from 'svelte';
	import {
		MessageType,
		type DisplayName,
		type Game,
		type Link,
		type Message,
		type Team,
		type User
	} from '$lib/model';
	import Fuse, { type FuseResult } from 'fuse.js';
	import { goto } from '$app/navigation';
	import hotkeys from 'hotkeys-js';

	type Props = {
		data: any;
		children?: Snippet;
	};

	let { data, children }: Props = $props();
	let switcherModalId = 'switcher-modal';
	type SwitcherItem = {
		displayName: DisplayName;
		link: Link;
		id: number;
		trophy_id: number;
		name: string;
	};

	let searchValue = $state('');
	let selectedIndex = $state(0);

	let mixedObjects = $derived([
		...data.teams.map((t: Team) => ({ ...t, displayName: 'Team', link: '/teams' })),
		...data.games.map((t: Game) => ({ ...t, displayName: 'Spiel', link: '/games' })),
		...data.users.map((t: User) => ({ ...t, displayName: 'Nutzer', link: '/users' }))
	] as SwitcherItem[]);
	const options = {
		keys: ['name', 'trophy_id', 'type'],
		threshold: 0.3
	};
	let fuse = $derived(new Fuse(mixedObjects, options));
	let searchResults = $derived.by(() => {
		if (searchValue != '') {
			// only display the first 10 results
			return fuse.search(searchValue).slice(0, 10);
		}
		return [];
	});

	let toast: Message | undefined = $state(undefined);
	const unsub = messageStore.subscribe((message) => {
		// Ignore the initial state of 'undefined' - I mainly still have this subscription
		// because of the setTimeout-function. Otherwise, we could simply use messageStore directly.
		if (message) {
			toast = message;
			setTimeout(() => (toast = undefined), 30000);
		}

		hotkeys.unbind();
	});

	hotkeys.filter = (_event) => true;
	hotkeys('ctrl+p,command+p,esc,enter,up,down', (event, handler) => {
		event.preventDefault();

		switch (handler.key) {
			case 'ctrl+p':
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
				let result: FuseResult<SwitcherItem> | undefined = searchResults[selectedIndex];
				// reset the switcher after capturing the result
				(document.getElementById(switcherModalId) as HTMLDialogElement).close();
				searchValue = '';
				if (result) {
					goto(`${result.item.link}/${result.item.id}`);
				}
				break;
			case 'up':
				if (selectedIndex == 0) {
					selectedIndex = searchResults.length - 1;
				} else {
					selectedIndex--;
				}
				break;
			case 'down':
				if (selectedIndex + 1 == searchResults.length) {
					selectedIndex = 0;
				} else {
					selectedIndex++;
				}
				break;
		}
	});

	onDestroy(unsub);
</script>

{@render children?.()}

{#if toast}
	<div class="absolute bottom-4 right-4 flex justify-end">
		<div
			class="alert"
			class:alert-info={toast.type == MessageType.Info}
			class:alert-success={toast.type == MessageType.Success}
			class:alert-warning={toast.type == MessageType.Warn}
			class:alert-error={toast.type == MessageType.Error}
			role="alert"
		>
			<div class="flex-1">
				<label class="mx-3" for="toast">{toast.message}</label>
			</div>
			<div class="flex-none">
				<button class="btn btn-sm btn-ghost mr-2" onclick={() => (toast = undefined)}>Ok</button>
			</div>
		</div>
	</div>
{/if}

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog class="modal" id={switcherModalId}>
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<form>
			<h1 class="font-bold text-xl text-center pb-2">Switcher</h1>

			<!-- svelte-ignore a11y_autofocus -->
			<input
				class="input input-bordered w-full mb-4"
				name="switcher"
				type="text"
				autofocus
				bind:value={searchValue}
			/>

			{#if searchValue != '' && searchResults && searchResults.length == 0}
				<p>
					Keine Treffer für '{searchValue}'.
				</p>
			{:else}
				<ul class="menu rounded-box w-full p-0 gap-1">
					{#each searchResults as result}
						<li class="w-full">
							<a
								href={`${result.item.link}/${result.item.id}`}
								onclick={() => {
									(document.getElementById(switcherModalId) as HTMLDialogElement).close();
									searchValue = '';
								}}
								class="flex flex-row justify-between w-full font-bold"
								class:bg-primary={result.refIndex == searchResults[selectedIndex].refIndex}
								class:text-white={result.refIndex == searchResults[selectedIndex].refIndex}
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
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
