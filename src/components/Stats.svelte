<script lang="ts">
	import { isTeam, type Game, type Team } from '$lib/model';

	type Props = {
		totalOutcomes: number;
		doneOutcomes: number;
		item: Team | Game;
	};

	let { totalOutcomes, doneOutcomes, item }: Props = $props();
	// since the type-guard returns a type predicate, we have to explicitly use a variable
	let itemIsTeam = isTeam(item);
	let linkPrefix = itemIsTeam ? 'teams' : 'games';
	let typeName = itemIsTeam ? 'Team' : 'Spiel';
</script>

<div class="tooltip tooltip-right" data-tip="Zum Bearbeiten klicken.">
	<a href={`/${linkPrefix}/${item.id}/edit`}>
		<div class="stats border">
			<div class="stat place-items-center">
				<div class="stat-title">Typ</div>
				<div class="stat-value">{typeName}</div>
			</div>

			<div class="stat place-items-center">
				<div class="stat-title">Name</div>
				<div class="stat-value">{item.name}</div>
			</div>

			<div class="stat place-items-center">
				<div class="stat-title">Trophy-ID</div>
				<div class="stat-value">{item.trophy_id}</div>
			</div>

			<!-- since isTeam only accepts two possible types, item must be a Game in else -->
			{#if isTeam(item)}
				<div class="stat place-items-center">
					<div class="stat-title">Typ</div>
					<div class="stat-value">{item.gender}</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">Punkte</div>
					<div class="stat-value text-primary">{item.points}</div>
				</div>
			{:else}
				<div class="stat place-items-center">
					<div class="stat-title">Typ</div>
					<div class="stat-value">{item.kind}</div>
				</div>
			{/if}

			<!-- only show percentage if there are any outcomes -->
			{#if totalOutcomes > 0}
				<div class="stat place-items-center">
					<div class="stat-title">Abgeschlossen</div>
					<div class="stat-value text-secondary">
						{Math.round((doneOutcomes / totalOutcomes) * 100)}%
					</div>
				</div>
			{/if}
		</div>
	</a>
</div>
