<script lang="ts">
	import { browser } from '$app/environment';
	import { yearStore } from '$lib/stores';

	// sync year to localStorage
	$: if (browser) {
		localStorage.setItem('year', $yearStore);
	}
</script>

<h1 class="absolute-center-x left-1/2 text-4xl font-bold pt-6">Einstellungen</h1>

<div class="w-full flex justify-center pt-20">
	<div class="flex flex-row w-1/3 justify-between min-w-96">
		<div class="flex items-center w-full">
			<h2 class="">Das Jahr der Trophy:</h2>
		</div>
		<select class="select select-bordered w-full max-w-xs" bind:value={$yearStore}>
			<!-- NOTE I've decided to do this manually for now -->
			<option selected>2024</option>
			<option>2025</option>
			<option>2026</option>
			<option>2027</option>
			<option>2028</option>
			<option>2029</option>
		</select>
	</div>
</div>
