<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { GameKind, MessageType } from '$lib/model.js';
	import { messageStore } from '$lib/stores';

	export let data;
	export let form;

	$: {
		if (form?.missing) {
			messageStore.set({
				type: MessageType.Error,
				message: `Das Feld '${form.field}' muss angegeben werden.`
			});
		} else if (form?.unauthorized) {
			messageStore.set({
				type: MessageType.Error,
				message: 'Das Spiel konnte nicht angelegt werden, bitte melde dich erneut an.'
			});
		} else if (form?.miscellaneous) {
			messageStore.set({
				type: MessageType.Error,
				message: `Etwas ist schiefgelaufen: ${form.detail}`
			});
		} else if (form?.success) {
			messageStore.set({
				type: MessageType.Success,
				message: `Änderungen an Spiel ${form.game.name} wurde erfolgreich gespeichert.`
			});
			goto(`/games/${data.game.id}`);
		}
	}
</script>

<h1 class="absolute-center-x left-1/2 text-4xl font-bold pt-6">
	<span class="underline">{data.game.name}</span> bearbeiten
</h1>

<form method="POST" class="flex flex-col w-80 m-auto gap-8" use:enhance>
	<div class="w-ful">
		<label class="label" for="trophy_id">
			<span class="label-text">Trophy-ID</span>
		</label>
		<input
			class="input input-bordered w-full"
			name="trophy_id"
			type="number"
			required
			min="1"
			value={data.game.trophy_id}
		/>
	</div>

	<div>
		<label class="label" for="name">
			<span class="label-text">Name</span>
		</label>
		<input
			class="input input-bordered w-full"
			name="name"
			type="text"
			required
			minlength="1"
			value={data.game.name}
		/>
	</div>

	<div>
		<label class="label" for="kind">
			<span class="label-text">Typ</span>
		</label>
		<select
			name="kind"
			class="select select-bordered w-full max-w-xs"
			required
			value={data.game.kind}
		>
			{#each Object.values(GameKind) as value}
				<option {value}> {value} </option>
			{/each}
		</select>
	</div>
	<button class="btn btn-neutral w-full">Speichern</button>
</form>
