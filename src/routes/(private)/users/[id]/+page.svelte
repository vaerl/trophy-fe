<script lang="ts">
	import Delete from '$lib/components/icons/Delete.svelte';
	import LeftArrow from '$lib/components/icons/LeftArrow.svelte';
	import Navbar from '$lib/components/blocks/Navbar.svelte';
	import DeleteModal from '$lib/components/modal/DeleteModal.svelte';
	import type { PageProps } from './$types';
	import Loader from '$lib/components/blocks/Loader.svelte';

	let { data }: PageProps = $props();

	function showDeletionModal() {
		(document.getElementById('confirm-deletion-modal') as HTMLDialogElement).showModal();
	}
</script>

<div class="flex flex-col h-full">
	<Navbar title={data.user.then((u) => u.name)}>
		{#snippet left()}
			<a href="/users"><LeftArrow /></a>
		{/snippet}
		{#snippet right()}
			<button class="h-min cursor-pointer" onclick={showDeletionModal}><Delete /></button>
		{/snippet}
	</Navbar>

	<div class="flex justify-center items-center grow">
		{#await data.user}
			<Loader></Loader>
		{:then item}
			<div class="stats border">
				<div class="stat place-items-center">
					<a href={`/users/${item.id}/edit`}>
						<div class="stat-title">Name</div>
						<div class="stat-value">{item.name}</div>
					</a>
				</div>

				<div class="stat place-items-center">
					<a href={`/users/${item.id}/edit`}>
						<div class="stat-title">Rolle</div>
						<div class="stat-value">{item.role}</div>
					</a>
				</div>
				<div class="stat place-items-center">
					<div class="stat-title">Spiel</div>
					<div class="stat-value">
						{#if item.game_id}
							<!-- link to the game if the user has one -->
							<a href={`/games/${item.game_id}`}>
								{item.game_name}
							</a>
						{:else}
							Kein Spiel
						{/if}
					</div>
				</div>
			</div>
		{/await}
	</div>

	<DeleteModal item={data.user}></DeleteModal>
</div>
