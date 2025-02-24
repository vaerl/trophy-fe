<script lang="ts">
	// this somehow just works, more here: https://svelte.dev/tutorial/kit/layouts
	let { children } = $props();
</script>

<!-- if this ever breaks, nest this and slot under a parent-div -->
<h1 class="text-6xl font-extrabold absolute-center-x pt-6">Übersicht</h1>

{@render children()}
