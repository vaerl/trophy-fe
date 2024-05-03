<script lang="ts">
	import PieChart from '../../../components/charts/PieChart.svelte';
	import LeftArrow from '../../../components/icons/LeftArrow.svelte';
	import RightArrow from '../../../components/icons/RightArrow.svelte';

	export let data;
	// TODO move eval to separate page
	// check if everything's done but also if there actually are things that should be done
	let done = data.pendingGames == 0 && data.pendingTeams == 0 && data.games > 0 && data.teams > 0;

	function startEval() {
		console.info('Starting evaluation.');
		window.open(import.meta.env.VITE_BACKEND_URL + '/eval', '_blank')?.focus();
	}
</script>

{#if done}
	<button class="btn btn-success mt-6" on:click={startEval}>Trophy auswerten</button>
{/if}

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

<!-- TODO test password-change, remove default password -->
<!-- TODO show a button for resetting the trophy -->
<!-- TODO make user removable even when IDs are used in history? -->
<!-- TODO add dashboard for final results -->
<!-- -> also: show download on that page, don't download on 'auswerten' - just create the page -->
<!-- -> multiple evaluations? -->
