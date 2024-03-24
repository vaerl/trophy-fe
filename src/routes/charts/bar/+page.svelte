<script lang="ts">
	import BarChart from '../../../components/charts/BarChart.svelte';
	import LeftArrow from '../../../components/icons/LeftArrow.svelte';

	export let data;
</script>

<div class="flex flex-row justify-evenly h-96">
	<BarChart games={data.games} name="Fertige Teams" totalTeamsAmount={data.teamsAmount} />
	<a class="absolute left-10 top-1/2 cursor-pointer" href="/charts/pie">
		<LeftArrow size={20} />
	</a>
</div>
