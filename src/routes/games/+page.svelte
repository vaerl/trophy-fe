<script lang="ts">
	import Breadcrumbs from '../../components/Breadcrumbs.svelte';
	import Table from '../../components/table/Table.svelte';
	import { games, pendingGames } from '../../lib/stores';

	let columns = [
		{ id: 'trophy_id', name: 'Trophy-ID' },
		{ id: 'name', name: 'Name' },
		{ id: 'kind', name: 'Punkttyp' }
	];

	games.get('games');
	pendingGames.get('games/pending');

	$: gamesLoading = games.loading;
	$: pendingGamesLoading = pendingGames.loading;
</script>

<Breadcrumbs paths={[]} current="Spiele" />
<Table
	type="game"
	items={games}
	itemsLoading={gamesLoading}
	pendingItems={pendingGames}
	pendingItemsLoading={pendingGamesLoading}
	{columns}
/>
