<script>
	import { beforeNavigate } from '$app/navigation';
	import { checkAuth } from '$lib/auth';
	import { loginStore } from '$lib/stores';
	import Login from '../components/Login.svelte';
	import '../app.css';

	// make this an SPA (for now)
	export const ssr = false;

	// check authentication initally
	checkAuth();

	// TODO exclude URLs?
	beforeNavigate(() => {
		checkAuth();
	});
</script>

{#if $loginStore}
	<slot />
{:else}
	<Login />
{/if}
