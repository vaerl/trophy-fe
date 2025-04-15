<script lang="ts">
	import Loader from '../../../components/blocks/Loader.svelte';
	import PieChart from '../../../components/charts/PieChart.svelte';
	import LeftArrow from '../../../components/icons/LeftArrow.svelte';
	import RightArrow from '../../../components/icons/RightArrow.svelte';

	let { data } = $props();
</script>

<div class="flex flex-row h-full justify-around">
	{#await Promise.all( [data.pendingTeams, data.finishedTeams, data.pendingGames, data.finishedGames] )}
		<Loader></Loader>
	{:then [pendingTeams, finishedTeams, pendingGames, finishedGames]}
		<div class="w-full h-full flex flex-row justify-between items-center">
			<a class="cursor-pointer" href="/overview/eval">
				<LeftArrow size={20} />
			</a>
			<PieChart name="Teams" open={pendingTeams} done={finishedTeams} link="/teams" />
			<PieChart name="Spiele" open={pendingGames} done={finishedGames} link="/games" />
			<a class="cursor-pointer" href="/overview/bar">
				<RightArrow size={20} />
			</a>
		</div>
	{/await}
</div>
