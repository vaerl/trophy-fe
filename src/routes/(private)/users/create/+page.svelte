<script lang="ts">
	import CreateUser from '$lib/components/CreateUser.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<CreateUser games={data.games}></CreateUser>
