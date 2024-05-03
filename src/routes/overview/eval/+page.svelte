<script lang="ts">
	import RightArrow from '../../../components/icons/RightArrow.svelte';

	export let data;

	let done = data.pendingGames == 0 && data.pendingTeams == 0 && data.games > 0 && data.teams > 0;
</script>

{#if done}
	<!-- TODO implement separate methods for downloading and evaluating -->
	<!-- TODO test multiple evaluations -->
	<button>Auswerten</button>
	<a href={import.meta.env.VITE_BACKEND_URL + '/eval/sheet'} target="_blank">CSV herunterladen</a>
{:else}
	<div class="absolute-center-y absolute-center-x text-center">
		<h1 class="text-4xl pb-4">Die Trophy kann noch nicht ausgewertet werden.</h1>

		<h2 class="text-2xl">
			Zuerst müssen noch
			<a href="/games" class="link">
				{data.pendingGames} Spiele
			</a>
			abgeschlossen werden.
		</h2>
	</div>
{/if}

<a class="absolute-center-y right-10 cursor-pointer" href="/overview/pie">
	<RightArrow size={20} />
</a>
