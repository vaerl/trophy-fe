<script lang="ts">
	import { goto } from '$app/navigation';
	import { checkAuth, logout } from '$lib/auth';
	import '../app.css';
	import { onMount } from 'svelte';
	import Info from '../components/icons/Info.svelte';
	import Logout from '../components/icons/Logout.svelte';
	import UserIcon from '../components/icons/UserIcon.svelte';
	import { page } from '$app/stores';
	import LeftArrow from '../components/icons/LeftArrow.svelte';
	import { messageStore } from '$lib/stores';
	import { onDestroy } from 'svelte';
	import { MessageType, type Message } from '$lib/model';
	import Plus from '../components/icons/Plus.svelte';
	import Home from '../components/icons/Home.svelte';
	import Cog from '../components/icons/Cog.svelte';

	// TODO stop always loading all teams/games, just react to websocket-messages
	// TODO show the done-status in game- and team-table -> this would require a lot of requests for each table though
	// TODO maybe block creation and updates once we've evaluated
	// TODO create and download PDFs directly, also be able to request singular PDFs
	// TODO maybe version outcomes -> list of outcomes and their creator, each outcome would know the next outcome
	// -> we could switch through outcomes in a modal
	// TODO provide a quick-switcher by pressing CTRL+p -> jump to games, teams, etc.

	onMount(async () => {
		let isAuthenticated = await checkAuth();
		if (!isAuthenticated) {
			goto('/login');
		}
	});

	let toast: Message | undefined = undefined;
	const unsub = messageStore.subscribe((message) => {
		// Ignore the initial state of 'undefined' - I mainly still have this subscription
		// because of the setTimeout-function. Otherwise, we could simply use messageStore directly.
		if (message) {
			toast = message;
			setTimeout(() => (toast = undefined), 30000);
		}
	});

	onDestroy(unsub);
</script>

<!-- this div makes sure that children respect parent's boundaries when using height: 100%-->
<div class="flex flex-col h-full">
	<!-- only show bar if we're not at /login -->
	{#if $page.route.id !== '/login'}
		<div class="flex flex-row justify-between py-6 px-4 w-full">
			<div class="flex flex-row">
				<!-- only show back-arrow if we're not at overview -->
				{#if !$page.route.id?.startsWith('/overview')}
					<a href="/overview/pie"><Home /></a>
					<button on:click={() => history.back()} class="ml-6"><LeftArrow /></button>
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
