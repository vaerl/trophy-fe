<script>
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

	onMount(async () => {
		let isAuthenticated = await checkAuth();
		if (!isAuthenticated) {
			goto('/login');
		}
	});
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
				<a href="/users"> <UserIcon /> </a>
				<a class="ml-6" href="/logs"> <Info /> </a>
				<button class="ml-6" on:click={logout}>
					<Logout />
				</button>
			</div>
		</div>
	{/if}

	<slot />
</div>
