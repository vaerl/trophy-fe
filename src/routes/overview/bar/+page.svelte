<script lang="ts">
	import BarChart from '../../../components/charts/BarChart.svelte';
	import LeftArrow from '../../../components/icons/LeftArrow.svelte';

	export let data;
</script>

<div class="absolute-center-y w-full">
	<div class="flex flex-row justify-evenly">
		<BarChart games={data.games} id="finished-teams" totalTeamsAmount={data.teamsAmount} />
	</div>
</div>
<a class="absolute-center-y left-10 cursor-pointer" href="/overview/pie">
	<LeftArrow size={20} />
</a>
