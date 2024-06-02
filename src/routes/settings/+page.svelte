<script lang="ts">
	import { yearStore } from '$lib/stores';

	// sync year to localStorage, because this depends on a store, it'll be set accordingly
	$: {
		localStorage.setItem('year', $yearStore);
	}
</script>

<h1 class="absolute-center-x left-1/2 text-4xl font-bold pt-6">Einstellungen</h1>

<div class="w-full flex justify-center pt-20">
	<div class="flex flex-row w-1/3 justify-between min-w-96">
		<div class="flex items-center w-full">
			<h2 class="">Jahr der Trophy:</h2>
		</div>
		<input
			class="input input-bordered w-full"
			name="trophy_id"
			type="number"
			required
			min="2020"
			max="2099"
			bind:value={$yearStore}
		/>
	</div>
</div>
