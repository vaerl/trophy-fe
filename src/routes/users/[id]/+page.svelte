<script lang="ts">
	import Details from '../../../components/details/Details.svelte';
</script>

<Details
	columns={[
		{ id: 'id', name: 'ID' },
		{ id: 'name', name: 'Nutzername' },
		{ id: 'password', name: 'Passwort' },
		{ id: 'role', name: 'Rolle' }
	]}
	type="user"
/>
