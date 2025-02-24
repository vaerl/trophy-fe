<script lang="ts">
	import BarChart from '../../../components/charts/BarChart.svelte';
	import LeftArrow from '../../../components/icons/LeftArrow.svelte';

	let { data } = $props();
</script>

{#await Promise.all([data.teamsAmount, data.gamesWithPending])}
	<span class="loading loading-spinner loading-lg absolute-center-y absolute-center-x"></span>
{:then [teamsAmount, gamesWithPending]}
	<div class="absolute-center-y w-full">
		<div class="flex flex-row justify-evenly">
			<BarChart games={gamesWithPending} id="finished-teams" teams={teamsAmount} />
		</div>
	</div>
{/await}
<a class="absolute-center-y left-10 cursor-pointer" href="/overview/pie">
	<LeftArrow size={20} />
</a>
