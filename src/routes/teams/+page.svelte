<script lang="ts">
	import { pendingTeams, teams } from '../../lib/stores';
	import Table from '../../components/table/Table.svelte';
	import Breadcrumbs from '../../components/Breadcrumbs.svelte';

	let columns = [
		{ id: 'trophy_id', name: 'Trophy-ID' },
		{ id: 'name', name: 'Name' },
		{ id: 'gender', name: 'Gender' },
		{ id: 'points', name: 'Punkte' }
	];

	teams.get('teams');
	pendingTeams.get('teams/pending');

	$: teamsLoading = teams.loading;
	$: pendingTeamsLoading = pendingTeams.loading;
</script>

<Breadcrumbs current="Teams" paths={[]} />

<Table
	type="team"
	items={teams}
	itemsLoading={teamsLoading}
	pendingItems={pendingTeams}
	pendingItemsLoading={pendingTeamsLoading}
	{columns}
/>
