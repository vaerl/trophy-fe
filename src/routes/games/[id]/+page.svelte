<script lang="ts">
	import Details from '../../../components/details/Details.svelte';
</script>

<Details
	columns={[
		{ id: 'trophy_id', name: 'Trophy-ID' },
		{ id: 'kind', name: 'Punktart' }
	]}
	type="game"
/>
