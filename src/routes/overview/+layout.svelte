<script lang="ts">
	import LogoutButton from '../../components/blocks/LogoutButton.svelte';
	import Navbar from '../../components/blocks/Navbar.svelte';
	import Cog from '../../components/icons/Cog.svelte';
	import Info from '../../components/icons/Info.svelte';
	import UserIcon from '../../components/icons/UserIcon.svelte';
	// this somehow just works, more here: https://svelte.dev/tutorial/kit/layouts
	let { children } = $props();
</script>

<div class="w-full h-full flex flex-col">
	<Navbar title="Übersicht">
		{#snippet left()}
			<a href="/settings"><Cog /></a>
		{/snippet}
		{#snippet right()}
			<a href="/users"> <UserIcon /> </a>
			<a href="/logs"> <Info /> </a>
			<LogoutButton></LogoutButton>
		{/snippet}
	</Navbar>

	{@render children()}
</div>
