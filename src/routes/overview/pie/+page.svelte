<script lang="ts">
	import PieChart from '../../../components/charts/PieChart.svelte';
	import LeftArrow from '../../../components/icons/LeftArrow.svelte';
	import RightArrow from '../../../components/icons/RightArrow.svelte';

	let { data } = $props();
</script>

{#await Promise.all([data.pendingTeams, data.finishedTeams, data.pendingGames, data.finishedGames])}
	<span class="loading loading-spinner loading-lg absolute-center-y absolute-center-x"></span>
{:then [pendingTeams, finishedTeams, pendingGames, finishedGames]}
	<div class="absolute-center-y w-full">
		<div class="flex flex-row justify-evenly">
			<PieChart name="Teams" open={pendingTeams} done={finishedTeams} link="/teams" />
			<PieChart name="Spiele" open={pendingGames} done={finishedGames} link="/games" />
		</div>
	</div>
{/await}

<a class="absolute-center-y right-10 cursor-pointer" href="/overview/bar">
	<RightArrow size={20} />
</a>
<a class="absolute-center-y left-10 cursor-pointer" href="/overview/eval">
	<LeftArrow size={20} />
</a>
