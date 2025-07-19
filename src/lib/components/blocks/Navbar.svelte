<script lang="ts">
	import type { Snippet } from 'svelte';
	import Loader from './Loader.svelte';
	import Group from '../icons/Group.svelte';
	import Home from '../icons/Home.svelte';
	import Puzzle from '../icons/Puzzle.svelte';
	import { page } from '$app/state';
	import UserCircle from '../icons/UserCircle.svelte';
	import { logout } from '$lib/auth';

	let {
		title,
		left,
		right,
		center
	}: {
		title?: string | Promise<string>;
		left?: Snippet;
		right?: Snippet;
		center?: Snippet;
	} = $props();

	// Default to false to show the home-icon. We need to use derived to react to changes.
	const routeIncludesOverview = $derived(page.route.id?.includes('/overview/pie') ?? false);
</script>

<div class="flex flex-row py-6 px-4 w-full">
	<div class="flex flex-row flex-1 gap-4">
		{#if !routeIncludesOverview}
			<a href="/overview/pie"><Home /></a>
		{/if}
		<a href="/teams"><Group /></a>
		<a href="/games"><Puzzle /></a>

		{@render left?.()}
	</div>

	{#if title}
		<div class="flex justify-center flex-1">
			{#await title}
				<Loader></Loader>
			{:then title}
				<h1 class="text-6xl font-extrabold">{title}</h1>
			{/await}
		</div>
	{:else if center}
		{@render center()}
	{/if}

	<div class="flex flex-row gap-4 justify-end flex-1">
		{@render right?.()}
		<div class="dropdown dropdown-end">
			<div tabindex="0" role="button" class="cursor-pointer">
				<UserCircle />
			</div>
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<ul
				tabindex="0"
				class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
			>
				<li><a href="/users">Nutzer</a></li>
				<li><a href="/logs">Logs</a></li>
				<li><a href="/settings">Einstellungen</a></li>
				<li><button onclick={logout}>Logout</button></li>
			</ul>
		</div>
	</div>
</div>
