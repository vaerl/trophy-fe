<script lang="ts">
	import BarChart from '../../../components/charts/BarChart.svelte';
	import LeftArrow from '../../../components/icons/LeftArrow.svelte';
	import Loader from '../../../components/Loader.svelte';

	let { data } = $props();
</script>

<div class="flex flex-row h-full justify-around">
	{#await Promise.all([data.teamsAmount, data.gamesWithPending])}
		<Loader></Loader>
	{:then [teamsAmount, gamesWithPending]}
		<div class="w-full h-full flex flex-row items-center justify-between">
			<a class="cursor-pointer" href="/overview/pie">
				<LeftArrow size={20} />
			</a>
			<BarChart games={gamesWithPending} id="finished-teams" teams={teamsAmount} />
			<!-- empty div so justify-between works-->
			<div></div>
		</div>
	{/await}
</div>
