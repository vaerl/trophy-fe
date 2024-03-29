<script lang="ts">
	import { goto } from '$app/navigation';
	import { checkAuth, logout } from '$lib/auth';
	import '../app.css';
	import { onMount } from 'svelte';
	import ThemeSwitch from '../components/ThemeSwitch.svelte';
	import Info from '../components/icons/Info.svelte';
	import Logout from '../components/icons/Logout.svelte';
	import UserIcon from '../components/icons/UserIcon.svelte';
	import { page } from '$app/stores';
	import LeftArrow from '../components/icons/LeftArrow.svelte';
	import { messageStore } from '$lib/stores';
	import { onDestroy } from 'svelte';
	import type { Message } from '$lib/model';
	import Plus from '../components/icons/Plus.svelte';

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
				<ThemeSwitch />
				<!-- only show back-arrow if we're not at charts -->
				{#if !$page.route.id?.startsWith('/charts')}
					<button class="ml-6" on:click={() => history.back()}><LeftArrow /></button>
				{/if}
			</div>

			<div class="flex flex-row">
				{#if $page.route.id === '/teams' || $page.route.id === '/games'}
					<a href={`${$page.route.id}/create`}> <Plus /> </a>
				{/if}

				<a class="ml-6" href="/users"> <UserIcon /> </a>
				<a class="ml-6" href="/logs"> <Info /> </a>
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
		<div class={`alert alert-${toast.type}`} role="alert">
			<div class="flex-1">
				<label class="mx-3" for="toast">{toast.message}</label>
			</div>
			<div class="flex-none">
				<button class="btn btn-sm btn-ghost mr-2" on:click={() => (toast = undefined)}>Ok</button>
			</div>
		</div>
	</div>
{/if}
