<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { MessageType, UserRole } from '$lib/model.js';
	import { messageStore, yearStore } from '$lib/stores';

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
				message: 'Der Nutzer konnte nicht angelegt werden, bitte melde dich erneut an.'
			});
		} else if (form?.miscellaneous) {
			messageStore.set({
				type: MessageType.Error,
				message: `Etwas ist schiefgelaufen: ${form.detail}`
			});
		} else if (form?.success) {
			messageStore.set({
				type: MessageType.Success,
				message: `Änderungen an Nutzer ${form.user.name} wurde erfolgreich gespeichert.`
			});
			goto('/users');
		}
	}
</script>

<h1 class="absolute-center-x left-1/2 text-4xl font-bold pt-6">Neuen Nutzer anlegen</h1>

<form
	method="POST"
	class="flex flex-col w-80 m-auto gap-8"
	use:enhance={({ formData }) => {
		formData.append('year', $yearStore);
		return async ({ result }) => {
			await applyAction(result);
		};
	}}
>
	<div class="w-full">
		<label class="label" for="name">
			<span class="label-text">Name</span>
		</label>
		<input class="input input-bordered w-full" name="name" type="text" required />
	</div>

	<div class="w-full">
		<label class="label" for="role">
			<span class="label-text">Rolle</span>
		</label>
		<select name="role" class="select select-bordered w-full max-w-xs" required>
			{#each Object.values(UserRole) as value}
				<option {value}> {value} </option>
			{/each}
		</select>
	</div>

	<div class="w-full">
		<label class="label" for="game">
			<span class="label-text">Spiel</span>
		</label>
		<select name="game" class="select select-bordered w-full max-w-xs" required value={null}>
			{#each data.games as game, id (game.id)}
				<option value={id}> {game.name} </option>
			{/each}

			<option value={null}> Kein Spiel </option>
		</select>
	</div>

	<div class="w-full">
		<label class="label" for="password">
			<span class="label-text">Passwort</span>
		</label>
		<input
			class="input input-bordered w-full"
			name="password"
			type="text"
			minlength="4"
			value={null}
		/>
	</div>

	<button class="btn btn-neutral w-full">Speichern</button>
</form>
