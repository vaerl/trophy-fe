<script>
	import { goto } from '$app/navigation';
	import { checkAuth } from '$lib/auth';
	import '../app.css';
	import { onMount } from 'svelte';
	import Sun from '../components/icons/Sun.svelte';
	import Moon from '../components/icons/Moon.svelte';
	import ThemeSwitch from '../components/ThemeSwitch.svelte';

	onMount(async () => {
		let isAuthenticated = await checkAuth();
		if (!isAuthenticated) {
			goto('/login');
		}
	});
</script>

<ThemeSwitch></ThemeSwitch>

<slot />
