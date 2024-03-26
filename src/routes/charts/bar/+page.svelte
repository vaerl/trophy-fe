<script lang="ts">
	import BarChart from '../../../components/charts/BarChart.svelte';
	import LeftArrow from '../../../components/icons/LeftArrow.svelte';

	export let data;
</script>

<div class="absolute-center-y w-full">
	<div class="flex flex-row justify-evenly">
		<BarChart games={data.games} name="Fertige Teams" totalTeamsAmount={data.teamsAmount} />
	</div>
</div>
<a class="absolute-center-y left-10 cursor-pointer" href="/charts/pie">
	<LeftArrow size={20} />
</a>
