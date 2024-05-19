<script lang="ts">
	import { page } from '$app/stores';
	import BarChart from '../../../components/charts/BarChart.svelte';
	import LeftArrow from '../../../components/icons/LeftArrow.svelte';

	export let data;
</script>

<div class="absolute-center-y w-full">
	<div class="flex flex-row justify-evenly">
		<BarChart games={data.gamesWithPending} id="finished-teams" teams={data.teamsAmount} />
	</div>
</div>
<a class="absolute-center-y left-10 cursor-pointer" href="/overview/pie{$page.url.search}">
	<LeftArrow size={20} />
</a>
