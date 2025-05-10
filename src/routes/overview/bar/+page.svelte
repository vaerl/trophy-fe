<script lang="ts">
	import Loader from '../../../components/blocks/Loader.svelte';
	import BarChart from '../../../components/charts/BarChart.svelte';
	import LeftArrow from '../../../components/icons/LeftArrow.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="flex flex-row h-full justify-around">
	{#await Promise.all([data.teams, data.gamesWithPending])}
		<Loader></Loader>
	{:then [teams, gamesWithPending]}
		<div class="w-full h-full flex flex-row items-center justify-between">
			<a class="cursor-pointer" href="/overview/pie">
				<LeftArrow size={20} />
			</a>
			<BarChart games={gamesWithPending} id="finished-teams" teams={teams.length} />
			<!-- empty div so justify-between works-->
			<div></div>
		</div>
	{/await}
</div>
