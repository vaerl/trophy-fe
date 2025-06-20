<script lang="ts">
	// NOTE this produces https://svelte.dev/docs/svelte/runtime-warnings#Client-warnings-ownership_invalid_mutation,
	// even though we use $bindable.
	let { time = $bindable() }: { time: string | null } = $props();
	let defaultTime = '00:00';

	if (time == null) {
		time = defaultTime;
	}

	function handleInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		let input = event.currentTarget.value.replace(/\D/g, '');

		// if the input is shorter than 4 digits, pad it with zeros at the beginning
		input = input.padStart(4, '0');

		let minutes = input.slice(0, 2);
		let seconds = input.slice(2, 4);

		minutes = Math.min(59, parseInt(minutes)).toString().padStart(2, '0');
		seconds = Math.min(59, parseInt(seconds)).toString().padStart(2, '0');

		time = `${minutes}:${seconds}`;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key >= '0' && event.key <= '9') {
			// ignore the colon
			let newTime = time!.replace(/:/g, '');
			newTime = (newTime + event.key).slice(-4);
			let minutes = newTime.slice(0, 2);
			let seconds = newTime.slice(2, 4);

			// make sure to not exceed the possible values for minutes or seconds
			minutes = Math.min(59, parseInt(minutes)).toString().padStart(2, '0');
			seconds = Math.min(59, parseInt(seconds)).toString().padStart(2, '0');

			time = `${minutes}:${seconds}`;
			event.preventDefault();
		}
	}
</script>

<div class="form-control w-full max-w-xs">
	<label for="timeInput" class="label">
		<span class="label-text">Gib eine Zeit an (mm:ss):</span>
	</label>
	<input
		id="time"
		type="text"
		bind:value={time}
		oninput={handleInput}
		onkeydown={handleKeydown}
		placeholder="mm:ss"
		maxlength="5"
		class="input input-bordered w-full max-w-xs"
	/>
</div>
