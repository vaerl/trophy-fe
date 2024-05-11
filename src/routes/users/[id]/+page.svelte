<script lang="ts">
	import Edit from '../../../components/icons/Edit.svelte';
	import Delete from '../../../components/icons/Delete.svelte';
	import { messageStore, yearStore } from '$lib/stores';
	import { MessageType } from '$lib/model';

	export let data;
	export let form;

	$: {
		if (form?.unauthorized) {
			messageStore.set({
				type: MessageType.Error,
				message: 'Das Ergebnis konnte nicht gespeichert werden, bitte melde dich erneut an.'
			});
		} else if (form?.miscellaneous) {
			messageStore.set({
				type: MessageType.Error,
				message: `Etwas ist schiefgelaufen: ${form.detail}`
			});
		}
	}
</script>

<!-- this is kinda hacky, but works -->
<div class="absolute right-0 top-0 py-6 mr-28 flex flex-row">
	<a href={`/users/${data.user.id}/edit?year=${$yearStore}`} class="ml-6"><Edit /></a>
	<form method="POST" action="?/delete">
		<button class="ml-6"><Delete /></button>
	</form>
</div>

<div class="absolute-center-x absolute-center-y">
	<div class="tooltip" data-tip="Zum Bearbeiten klicken.">
		<a href={`/users/${data.user.id}/edit?year=${$yearStore}`}>
			<div class="stats border">
				<div class="stat place-items-center">
					<div class="stat-title">Name</div>
					<div class="stat-value">{data.user.name}</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">Rolle</div>
					<div class="stat-value">{data.user.role}</div>
				</div>

				<!-- link to the game if the user has one -->
				{#if data.user.game_id}
					<a href={`/games/${data.user.game_id}`}>
						<div class="stat place-items-center">
							<div class="stat-title">Spiel</div>
							<div class="stat-value">{data.user.game_name}</div>
						</div>
					</a>
				{/if}
			</div>
		</a>
	</div>
</div>
