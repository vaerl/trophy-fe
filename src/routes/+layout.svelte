<script>
	import { beforeNavigate } from '$app/navigation';
	import { checkAuth } from '$lib/auth';
	import { loginStore } from '$lib/stores';
	import Login from '../components/Login.svelte';
	import '../app.css';

	// check authentication initially
	checkAuth();

	// TODO exclude URLs?
	beforeNavigate(() => {
		checkAuth();
	});
	// TODO there must be a better way
</script>

{#if $loginStore}
	<slot />
{:else}
	<Login />
{/if}
