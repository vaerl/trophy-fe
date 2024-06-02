<script lang="ts">
	import PieChart from '../../../components/charts/PieChart.svelte';
	import LeftArrow from '../../../components/icons/LeftArrow.svelte';
	import RightArrow from '../../../components/icons/RightArrow.svelte';

	export let data;
</script>

<div class="absolute-center-y w-full">
	<div class="flex flex-row justify-evenly">
		<PieChart name="Teams" open={data.pendingTeams} done={data.finishedTeams} link="/teams" />
		<PieChart name="Spiele" open={data.pendingGames} done={data.finishedGames} link="/games" />
	</div>
</div>
<a class="absolute-center-y right-10 cursor-pointer" href="/overview/bar">
	<RightArrow size={20} />
</a>
<a class="absolute-center-y left-10 cursor-pointer" href="/overview/eval">
	<LeftArrow size={20} />
</a>
