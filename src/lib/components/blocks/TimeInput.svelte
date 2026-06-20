<script lang="ts">
	let { time = $bindable() }: { time: string | null } = $props();
</script>

<div class="form-control w-full max-w-xs">
	<label for="timeInput" class="label">
		<span class="label-text">Gib eine Zeit in Sekunden an:</span>
	</label>
	<input
		name="data"
		type="text"
		bind:value={time}
		placeholder="s"
		maxlength="5"
		class="input input-bordered w-full max-w-xs"
	/>
</div>
