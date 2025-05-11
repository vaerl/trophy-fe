<script lang="ts">
	import CreateGame from '$lib/components/CreateGame.svelte';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<CreateGame game={data.game}></CreateGame>
