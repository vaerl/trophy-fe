<script lang="ts">
	import Breadcrumbs from '../../../components/Breadcrumbs.svelte';
	import Create from '../../../components/details/Create.svelte';
	import type { Path } from '../../../lib/data';
	import { GameKind, type Game } from '../../../lib/model';

	let game: Game = {
		id: -1,
		trophy_id: -1,
		name: '',
		kind: GameKind.Points,
		locked: false
	};

	let paths: Path[] = [{ name: 'Spiele', path: '/games' }];
	let current = 'Neues Spiel';
</script>

<div class="h-full">
	<Breadcrumbs {paths} {current} />
	<Create edit={false} item={game} type="game" />
</div>
