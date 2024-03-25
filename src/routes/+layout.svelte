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

	onMount(async () => {
		let isAuthenticated = await checkAuth();
		if (!isAuthenticated) {
			goto('/login');
		}
	});
</script>

<!-- only show bar if we're not at /login -->
{#if $page.route.id !== '/login'}
	<div class="absolute left-2 pt-6 pl-4">
		<ThemeSwitch></ThemeSwitch>
	</div>

	<div class="absolute right-2 pt-6 pr-4 flex">
		<a href="/users"> <UserIcon /> </a>
		<a class="ml-6" href="/logs"> <Info /> </a>
		<button class="ml-6" on:click={logout}>
			<Logout />
		</button>
	</div>
{/if}

<slot />
