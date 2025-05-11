<script>
	import { page } from '$app/state';
	import LogoutButton from '$lib/components/blocks/LogoutButton.svelte';
	import Navbar from '$lib/components/blocks/Navbar.svelte';
	import Cog from '$lib/components/icons/Cog.svelte';
	import Info from '$lib/components/icons/Info.svelte';
	import UserIcon from '$lib/components/icons/UserIcon.svelte';

	// NOTE this mainly handles requests for non-existent pages.
	// TO catch these, it has to sit at the top-level.
</script>

<div class="w-full h-full flex flex-col">
	<Navbar title="Fehler">
		{#snippet left()}
			<a href="/settings"><Cog /></a>
		{/snippet}
		{#snippet right()}
			<a href="/users"> <UserIcon /> </a>
			<a href="/logs"> <Info /> </a>
			<LogoutButton></LogoutButton>
		{/snippet}
	</Navbar>
	<div class="flex grow text-center items-center justify-center">
		<div class="flex flex-col">
			<h1 class="font-extrabold text-2xl pb-4">
				Ein Fehler ist aufgetreten: {page.status} - {page.error?.message}
			</h1>
			<a href="/overview/pie"><h2 class="font-bold link text-xl">Zurück zur Übersicht</h2></a>
		</div>
	</div>
</div>
