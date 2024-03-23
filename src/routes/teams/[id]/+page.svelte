<script lang="ts">
	import Details from '../../../components/details/Details.svelte';
</script>

<!-- TODO fix this - the outcomes don't show up -->
<Details
	columns={[
		{ id: 'trophy_id', name: 'Trophy-ID' },
		{ id: 'gender', name: 'Geschlecht' }
	]}
	type="team"
/>
