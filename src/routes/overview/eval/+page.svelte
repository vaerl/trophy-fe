<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { MessageType } from '$lib/model';
	import { messageStore, paramStore } from '$lib/stores';
	import RightArrow from '../../../components/icons/RightArrow.svelte';

	let { data } = $props();
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	async function evaluate() {
		const res = await fetch(`${baseUrl}/eval${$paramStore}`, {
			credentials: 'include'
		});
		// reload page.ts after evaluating
		invalidateAll();

		if (res.status == 200) {
			messageStore.set({
				type: MessageType.Success,
				message: 'Trophy evaluiert.'
			});
		} else {
			messageStore.set({
				type: MessageType.Error,
				message: `Fehler beim Evaluieren: ${res.body}`
			});
		}
	}
</script>

<div class="flex flex-row h-full justify-around">
	{#await Promise.all([data.trophyDone, data.evalDone, data.pendingGames])}
		<span class="loading loading-spinner loading-lg"></span>
	{:then [trophyDone, evalDone, pendingGames]}
		<div class="w-full h-full flex flex-row justify-between items-center">
			<!-- empty div so justify-between works-->
			<div></div>
			{#if trophyDone && !evalDone}
				<div class="text-center">
					<h1 class="text-4xl pb-8">Die Trophy kann ausgewertet werden.</h1>
					<button class="btn btn-primary" onclick={evaluate}>Auswerten</button>
				</div>
			{:else if evalDone}
				<div class="text-center">
					<h1 class="text-4xl pb-4">Die Trophy ist ausgewertet.</h1>
					<a href={`${baseUrl}/eval/sheet${$paramStore}`} class="link text-2xl" target="_blank">
						Ergebnisse herunterladen.
					</a>
				</div>
			{:else}
				<div class="text-center">
					<h1 class="text-4xl pb-4">Die Trophy kann noch nicht ausgewertet werden.</h1>

					<h2 class="text-2xl">
						{#if pendingGames == 1}
							Zuerst muss noch
							<a href="/games" class="link">
								{pendingGames} Spiel
							</a>
						{:else}
							Zuerst müssen noch
							<a href="/games" class="link">
								{pendingGames} Spiele
							</a>
						{/if}

						abgeschlossen werden.
					</h2>
				</div>
			{/if}
			<a class="cursor-pointer" href="/overview/pie">
				<RightArrow size={20} />
			</a>
		</div>
	{/await}
</div>
