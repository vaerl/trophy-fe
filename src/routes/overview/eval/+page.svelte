<script lang="ts">
	import { page } from '$app/stores';
	import { MessageType } from '$lib/model';
	import { messageStore } from '$lib/stores';
	import RightArrow from '../../../components/icons/RightArrow.svelte';

	export let data;
	let trophyDone = data.trophyDone.status;
	let evalDone = data.evalDone.status;
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	async function evaluate() {
		const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

		const res = await fetch(`${baseUrl}/eval${$page.url.search}`, {
			credentials: 'include'
		});

		if (res.status == 200) {
			messageStore.set({
				type: MessageType.Success,
				message: 'Trophy evaluiert.'
			});
			evalDone = true;
		} else {
			console.log(res);
			messageStore.set({
				type: MessageType.Error,
				message: `Fehler beim Evaluieren: ${res.body}`
			});
		}
	}
</script>

{#if trophyDone && !evalDone}
	<div class="absolute-center-y absolute-center-x text-center">
		<h1 class="text-4xl pb-8">Die Trophy kann ausgewertet werden.</h1>

		<button class="btn btn-primary" on:click={evaluate}>Auswerten</button>
	</div>
{:else if evalDone}
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
