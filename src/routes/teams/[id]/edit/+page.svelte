<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { MessageType, TeamGender } from '$lib/model.js';
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
				message: 'Das Team konnte nicht angelegt werden, bitte melde dich erneut an.'
			});
		} else if (form?.miscellaneous) {
			messageStore.set({
				type: MessageType.Error,
				message: `Etwas ist schiefgelaufen: ${form.detail}`
			});
		} else if (form?.success) {
			messageStore.set({
				type: MessageType.Success,
				message: `Änderungen an Team ${form.team.name} wurde erfolgreich gespeichert.`
			});
			goto(`/teams/${data.team.id}`);
		}
	}
</script>

<h1 class="absolute-center-x left-1/2 text-4xl font-bold pt-6">
	<span class="underline">{data.team.name}</span> bearbeiten
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
			value={data.team.trophy_id}
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
			value={data.team.name}
		/>
	</div>

	<div>
		<label class="label" for="gender">
			<span class="label-text">Typ</span>
		</label>
		<select
			name="gender"
			class="select select-bordered w-full max-w-xs"
			required
			value={data.team.gender}
		>
			{#each Object.values(TeamGender) as value}
				<option {value}> {value} </option>
			{/each}
		</select>
	</div>
	<button class="btn btn-neutral w-full">Speichern</button>
</form>
