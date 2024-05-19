<script lang="ts">
	import { page } from '$app/stores';
	import RightArrow from '../../../components/icons/RightArrow.svelte';

	export let data;
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
</script>

{#if data.trophyDone.status && !data.evalDone.status}
	<button>Auswerten</button>
	<a href={`${baseUrl}/eval${$page.url.search}`}>CSV herunterladen</a>
{:else if data.evalDone.status}
	<div class="absolute-center-y absolute-center-x text-center">
		<h1 class="text-4xl pb-4">Die Trophy ist ausgewertet.</h1>

		<a href={`${baseUrl}/eval/sheet${$page.url.search}`} class="link text-2xl" target="_blank">
			Ergebnisse herunterladen.
		</a>
	</div>
{:else}
	<div class="absolute-center-y absolute-center-x text-center">
		<h1 class="text-4xl pb-4">Die Trophy kann noch nicht ausgewertet werden.</h1>

		<h2 class="text-2xl">
			Zuerst müssen noch
			<a href="/games{$page.url.search}" class="link">
				{data.pendingGames} Spiele
			</a>
			abgeschlossen werden.
		</h2>
	</div>
{/if}

<a class="absolute-center-y right-10 cursor-pointer" href="/overview/pie{$page.url.search}">
	<RightArrow size={20} />
</a>
