<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	onMount(async () => {
		$page.url.searchParams.set('year', '2024');
		goto(`/overview/pie${$page.url.search}`);
	});
</script>
