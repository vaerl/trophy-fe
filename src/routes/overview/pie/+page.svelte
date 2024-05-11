<script lang="ts">
	import { page } from '$app/stores';
	import PieChart from '../../../components/charts/PieChart.svelte';
	import LeftArrow from '../../../components/icons/LeftArrow.svelte';
	import RightArrow from '../../../components/icons/RightArrow.svelte';

	export let data;
</script>

<div class="absolute-center-y w-full">
	<div class="flex flex-row justify-evenly">
		<PieChart
			name="Teams"
			open={data.pendingTeams}
			done={data.finishedTeams}
			link="/teams{$page.url.search}"
		/>
		<PieChart
			name="Spiele"
			open={data.pendingGames}
			done={data.finishedGames}
			link="/games{$page.url.search}"
		/>
	</div>
</div>
<a class="absolute-center-y right-10 cursor-pointer" href="/overview/bar{$page.url.search}">
	<RightArrow size={20} />
</a>
<a class="absolute-center-y left-10 cursor-pointer" href="/overview/eval{$page.url.search}">
	<LeftArrow size={20} />
</a>

<!-- TODO test password-change, remove default password -->
<!-- TODO show a button for resetting the trophy -->
<!-- TODO make user removable even when IDs are used in history? -->
