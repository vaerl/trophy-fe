<script lang="ts">
	import ItemsTable from '$lib/components/table/ItemsTable.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<ItemsTable items={data.games}></ItemsTable>
