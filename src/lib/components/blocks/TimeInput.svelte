<script lang="ts">
	import { autofocus } from '$lib/util';
	let { time = $bindable() }: { time: string | null } = $props();
</script>

<div class="form-control w-full max-w-xs">
	<label for="timeInput" class="label">
		<span class="label-text">Gib eine Zeit in Sekunden an:</span>
	</label>
	<!-- svelte-ignore a11y_autofocus -->
	<input
		name="data"
		type="text"
		bind:value={time}
		placeholder="s"
		maxlength="5"
		class="input input-bordered w-full max-w-xs"
		autofocus
		use:autofocus
	/>
</div>
