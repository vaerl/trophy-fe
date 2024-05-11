<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { yearStore } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(async () => {
		$page.url.searchParams.set('year', $yearStore);
		goto(`/overview/pie${$page.url.search}`);
	});
</script>
