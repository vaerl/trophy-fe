<script lang="ts">
	import { isTeam, type Game, type Outcome, type Team } from '$lib/model';
	import { doneOutcomeFilter, linkPrefix, typeName } from '$lib/util';
	import Loader from './Loader.svelte';

	type Props = {
		outcomes: Promise<Outcome[]>;
		item: Promise<Team | Game>;
	};

	let { item, outcomes }: Props = $props();
</script>

{#await Promise.all([item, outcomes])}
	<Loader></Loader>
{:then [item, outcomes]}
	<div class="tooltip tooltip-right" data-tip="Zum Bearbeiten klicken.">
		<a href={`/${linkPrefix(item)}/${item.id}/edit`}>
			<div class="stats border">
				<div class="stat place-items-center">
					<div class="stat-title">Typ</div>
					<div class="stat-value">{typeName(item)}</div>
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
				{#if outcomes.length > 0}
					<div class="stat place-items-center">
						<div class="stat-title">Abgeschlossen</div>
						<div class="stat-value text-secondary">
							{Math.round((outcomes.filter(doneOutcomeFilter).length / outcomes.length) * 100)}%
						</div>
					</div>
				{/if}
			</div>
		</a>
	</div>
{/await}
