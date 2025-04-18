<script lang="ts">
	import CreateTeam from '../../../../components/CreateTeam.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<CreateTeam team={data.team}></CreateTeam>
