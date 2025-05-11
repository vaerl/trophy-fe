<script lang="ts">
	import CreateTeam from '$lib/components/CreateTeam.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<CreateTeam team={data.team}></CreateTeam>
