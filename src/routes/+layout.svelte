<script lang="ts">
	import { logout } from '$lib/auth';
	import '../app.css';
	import Info from '../components/icons/Info.svelte';
	import Logout from '../components/icons/Logout.svelte';
	import UserIcon from '../components/icons/UserIcon.svelte';
	import { page } from '$app/stores';
	import { messageStore } from '$lib/stores';
	import { onDestroy } from 'svelte';
	import { MessageType, type DisplayName, type Link, type Message } from '$lib/model';
	import Plus from '../components/icons/Plus.svelte';
	import Home from '../components/icons/Home.svelte';
	import Cog from '../components/icons/Cog.svelte';
	import Fuse from 'fuse.js';
	import { goto } from '$app/navigation';

	// TODO stop always loading all teams/games, just react to websocket-messages
	// TODO show the done-status in game- and team-table -> this would require a lot of requests for each table though
	// TODO maybe block creation and updates once we've evaluated
	// TODO create and download PDFs directly, also be able to request singular PDFs
	// TODO maybe version outcomes -> list of outcomes and their creator, each outcome would know the next outcome
	// -> we could switch through outcomes in a modal
	// TODO show loaders if possible/a good idea -> see https://kit.svelte.dev/docs/load#streaming-with-promises
	// TODO fix the calc-occurrences -> layout in details is scuffed, using "height: 100%" isn' working because of the stats-stuff

	export let data;

	let isCtrlDown = false,
		isPDown = false,
		showSwitcher = false;
	let searchValue = '',
		searchResults: any[] = [],
		selectedIndex: number;

	$: {
		if (searchValue != '') {
			// only display the first 10 results
			searchResults = fuse.search(searchValue).slice(0, 10);
			if (searchResults.length > 0) {
				selectedIndex = 0;
			}
		} else {
			searchResults = [];
		}
	}

	$: mixedObjects = [
		...data.teams.map((t) => ({ ...t, displayName: 'Team', link: '/teams' })),
		...data.games.map((t) => ({ ...t, displayName: 'Spiel', link: '/games' })),
		...data.users.map((t) => ({ ...t, displayName: 'Nutzer', link: '/users' }))
	] as { displayName: DisplayName; link: Link; id: number; trophy_id: number }[];
	const options = {
		keys: ['name', 'trophy_id', 'type'],
		threshold: 0.3
	};
	$: fuse = new Fuse(mixedObjects, options);

	let toast: Message | undefined = undefined;
	const unsub = messageStore.subscribe((message) => {
		// Ignore the initial state of 'undefined' - I mainly still have this subscription
		// because of the setTimeout-function. Otherwise, we could simply use messageStore directly.
		if (message) {
			toast = message;
			setTimeout(() => (toast = undefined), 30000);
		}
	});

	function keyDown(event: any) {
		// `keydown` event is fired while the physical key is held down.

		// Assuming you only want to handle the first press, we early
		// return to skip.
		if (event.repeat) {
			return;
		}
		// handle up- and down-arrows if the switcher is open
		if (showSwitcher && searchResults.length > 0) {
			switch (event.key) {
				case 'ArrowUp':
					if (selectedIndex == 0) {
						selectedIndex = searchResults.length - 1;
					} else {
						selectedIndex--;
					}
					return;
				case 'ArrowDown':
					if (selectedIndex + 1 == searchResults.length) {
						selectedIndex = 0;
					} else {
						selectedIndex++;
					}
					return;
				case 'Enter':
					const result = searchResults[selectedIndex];
					searchValue = '';
					showSwitcher = false;
					goto(`${result.item.link}/${result.item.id}`);
					return;
			}
		}

		// In the switch-case we're updating our boolean flags whenever the
		// desired bound keys are pressed.
		switch (event.key) {
			case 'Control':
				isCtrlDown = true;
				// By using `preventDefault`, it tells the Browser not to handle the
				// key stroke for its own shortcuts or text input.
				event.preventDefault();
				break;
			case ' ':
				isPDown = true;
				break;
			case 'Escape':
				showSwitcher = false;
				searchValue = '';
				break;
		}

		// only show the switcher if it's not already visible -> this should ignore updates when the switcher is already open
		// don't show the switcher for /login
		if (!showSwitcher && isCtrlDown && isPDown && !$page.route.id?.startsWith('/login')) {
			showSwitcher = true;
		}
	}

	function keyUp(event: any) {
		// `keyup` is the reverse, it fires whenever the physical key was let.
		// go after being held down

		// Just like our `keydown` handler, we need to update the boolean
		// flags, but in the opposite direction.
		switch (event.key) {
			case 'Control':
				isCtrlDown = false;
				event.preventDefault();
				break;
			case ' ':
				isPDown = false;
				event.preventDefault();
				break;
		}
	}

	onDestroy(unsub);
</script>

<svelte:window on:keydown={keyDown} on:keyup={keyUp} />

<!-- this div makes sure that children respect parent's boundaries when using height: 100%-->
<div class="flex flex-col h-full">
	<!-- only show bar if we're not at /login -->
	{#if $page.route.id !== '/login'}
		<div class="flex flex-row justify-between py-6 px-4 w-full">
			<div class="flex flex-row">
				<!-- only show back-arrow if we're not at overview -->
				{#if !$page.route.id?.startsWith('/overview')}
					<a href="/overview/pie"><Home /></a>
				{/if}

				{#if $page.route.id?.startsWith('/overview')}
					<a href="/settings"><Cog /></a>
				{/if}
			</div>

			<div class="flex flex-row">
				{#if $page.route.id === '/teams' || $page.route.id === '/games' || $page.route.id === '/users'}
					<a href={`${$page.route.id}/create`}> <Plus /> </a>
				{/if}

				{#if !$page.route.id?.startsWith('/users')}
					<a class="ml-6" href="/users"> <UserIcon /> </a>
				{/if}

				{#if !$page.route.id?.startsWith('/logs')}
					<a class="ml-6" href="/logs"> <Info /> </a>
				{/if}

				<button class="ml-6" on:click={logout}>
					<Logout />
				</button>
			</div>
		</div>
	{/if}

	<slot />
</div>

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
				<button class="btn btn-sm btn-ghost mr-2" on:click={() => (toast = undefined)}>Ok</button>
			</div>
		</div>
	</div>
{/if}

{#if showSwitcher}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<dialog class="modal modal-open">
		<form id="confirmation-form w-full" class="modal-box">
			<h1 class="font-bold text-xl text-center pb-2">Switcher</h1>

			<!-- svelte-ignore a11y-autofocus -->
			<input
				class="input input-bordered w-full mb-4"
				name="switcher"
				type="text"
				autofocus
				bind:value={searchValue}
			/>

			{#if searchValue != '' && searchResults.length == 0}
				<p>
					Keine Treffer für '{searchValue}'.
				</p>
			{:else}
				<ul class="menu rounded-box w-full p-0 gap-1">
					{#each searchResults as result}
						<li class="w-full">
							<div
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
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</form>
	</dialog>
{/if}
