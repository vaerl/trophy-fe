<script lang="ts">
	import { users } from '$lib/stores';
	import Table from '../../components/table/Table.svelte';
	import { writable } from 'svelte/store';
	import Breadcrumbs from '../../components/Breadcrumbs.svelte';

	users.get('users');
</script>

<Breadcrumbs current="Teams" paths={[]} />

<Table
	type="user"
	columns={[
		{ id: 'name', name: 'Nutzer' },
		{ id: 'role', name: 'Rolle' }
	]}
	items={users}
	itemsLoading={users.loading}
	pendingItems={writable([])}
	pendingItemsLoading={writable(false)}
/>
