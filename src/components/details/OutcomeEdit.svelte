<script lang="ts">
	import { getNameById } from '$lib/util';
	import { GameKind, Message, MessageType } from '../../lib/model';
	import type { Game, Outcome } from '../../lib/model';
	import { messageStore, outcome, teams } from '../../lib/stores';

	export let game: Game;
	export let currentOutcome: Outcome;
	export let modalOpen: boolean;

	// TODO load correctly here - maybe just pass these into the component?
	// -> this might need both teams and games -> for usage in /teams and /games, also dialog
	teams.get('teams');

	async function saveOutcome(o: Outcome) {
		await outcome.put('outcomes', undefined, {
			game_id: o.game_id,
			team_id: o.team_id,
			data: String(o.data),
			point_value: o.point_value,
			game_trophy_id: o.game_trophy_id,
			team_trophy_id: o.team_trophy_id
		});
		modalOpen = false;
		messageStore.set(new Message(MessageType.Info, 'Ergebnis wurde erfolgreich angelegt.'));
	}
</script>

<div class="modal modal-open">
	<!-- TODO fix height, should use better width -->
	<div class="modal-box h-2/3">
		<h1 class="font-extrabold text-2xl">
			<!-- TODO this needs to be bidirectional -->
			<!-- TODO also supply correct id -->
			Ergebnis für {getNameById($teams, currentOutcome.team_id).name} ({currentOutcome.team_id}) bei {game.name}
		</h1>
		<!-- TODO focus the input when opening -->
		<!-- TODO support enter to save, esc to cancel -->
		<!-- TODO maybe support deleting -> values with 'null' should not show up under completed -->
		<div class="modal-action justify-between flex-col h-3/4">
			<div class="flex justify-center">
				{#if game.kind == GameKind.Points}
					<input
						class="input input-bordered"
						bind:value={currentOutcome.data}
						type="number"
						placeholder="Punkte"
					/>
				{:else}
					<input
						class="input input-bordered"
						bind:value={currentOutcome.data}
						type="text"
						placeholder="Zeit"
					/>
				{/if}
			</div>
			<div class="flex flex-row justify-between">
				<label for="outcome-modal" class="btn" on:click={() => (modalOpen = false)}>Abbrechen</label
				>
				<label
					for="outcome-modal"
					class="btn btn-primary"
					on:click={() => saveOutcome(currentOutcome)}>Speichern</label
				>
			</div>
		</div>
	</div>
</div>
