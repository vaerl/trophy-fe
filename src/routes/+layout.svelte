<script>
	import { goto } from '$app/navigation';
	import { checkAuth } from '$lib/auth';
	import '../app.css';
	import { onMount } from 'svelte';

	onMount(async () => {
		let isAuthenticated = await checkAuth();
		if (!isAuthenticated) {
			goto('/login');
		}
	});
</script>

<slot />
