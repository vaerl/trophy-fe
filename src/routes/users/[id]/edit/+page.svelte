<script lang="ts">
	import CreateUser from '../../../../components/CreateUser.svelte';

	let { data } = $props();
</script>

<CreateUser user={data.user} games={data.games}></CreateUser>
