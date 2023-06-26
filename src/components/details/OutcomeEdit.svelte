<script lang="ts">
	import { GameKind, Message, MessageType } from '../../lib/model';
	import type { Game, Outcome } from '../../lib/model';
	import { messageStore, outcome } from '../../lib/stores';

	export let game: Game;
	export let currentOutcome: Outcome;
	export let modalOpen: boolean;

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
	<div class="modal-box h-1/3">
		<h1 class="font-extrabold text-2xl">
			Ergebnis für {game.name}
		</h1>
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
						type="time"
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
