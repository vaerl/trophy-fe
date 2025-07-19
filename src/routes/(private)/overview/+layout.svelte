<script lang="ts">
	import Navbar from '$lib/components/blocks/Navbar.svelte';
	let { children } = $props();
</script>

<div class="w-full h-full flex flex-col">
	<Navbar title="Übersicht" />

	{@render children()}
</div>
