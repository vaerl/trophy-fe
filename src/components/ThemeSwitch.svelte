<script lang="ts">
	import Moon from './icons/Moon.svelte';
	import Sun from './icons/Sun.svelte';
	import { onMount } from 'svelte';

	type Theme = 'light' | 'dark';
	let currentTheme: Theme = 'light';

	onMount(() => {
		if (typeof window !== 'undefined') {
			const theme = window.localStorage.getItem('theme');
			if (theme) {
				document.documentElement.setAttribute('data-theme', theme);
				currentTheme = theme as Theme;
			}
		}
	});

	function toggleTheme() {
		currentTheme = currentTheme == 'light' ? 'dark' : 'light';
		const one_year = 60 * 60 * 24 * 365;
		window.localStorage.setItem('theme', currentTheme);
		document.cookie = `theme=${currentTheme}; max-age=${one_year}; path=/; SameSite=Lax`;
		document.documentElement.setAttribute('data-theme', currentTheme);
	}
</script>

<label class="swap swap-rotate">
	<input
		type="checkbox"
		class="theme-controller"
		bind:value={currentTheme}
		on:click={toggleTheme}
	/>
	<Sun />
	<Moon />
</label>
