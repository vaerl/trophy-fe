<script lang="ts">
	import { Message, MessageType } from '$lib/model';
	import { messageStore, previousMessageStore } from '$lib/stores';
	import { onDestroy } from 'svelte';
	import UserIcon from '../../components/icons/UserIcon.svelte';
	import Info from '../../components/icons/Info.svelte';
	import { logout } from '$lib/auth';
	import Logout from '../../components/icons/Logout.svelte';

	// message-toasts
	let showToast: boolean = false;
	let toastMessage: string = '';
	let toastClass: string = 'alert';

	// TODO make messages work again
	const unsub = messageStore.subscribe((message: Message) => {
		// show complete message in console
		console.debug(message);
		if (message.type != MessageType.Initial && message.isAfter($previousMessageStore)) {
			toastMessage = message.message;
			showToast = true;
			switch (message.type) {
				case MessageType.Info:
					toastClass = 'alert alert-info';
					break;
				case MessageType.Update:
					toastClass = 'alert alert-success';
					break;
				case MessageType.Error:
					toastClass = 'alert alert-error';
					break;
				default:
					toastClass = 'alert';
					break;
			}

			setTimeout(() => (showToast = false), 30000);

			previousMessageStore.set(message);
		}
	});

	onDestroy(unsub);
</script>

<div class="flex flex-row w-full pb-20 pt-8 justify-center">
	<div>
		<h1 class="text-5xl font-extrabold">Übersicht</h1>
	</div>
	<div class="absolute right-2">
		<a class="btn btn-circle btn-ghost" href="/users"> <UserIcon /> </a>
		<a class="btn btn-circle btn-ghost" href="/logs"> <Info /> </a>
		<button class="btn btn-circle btn-ghost" on:click={logout}>
			<Logout></Logout>
		</button>
	</div>
</div>

<slot />

{#if showToast}
	<div class="w-full absolute bottom-4 right-4 flex justify-end">
		<div class={toastClass + 'w-1/3'} id="toast">
			<div class="flex-1">
				<label class="mx-3" for="toast">{toastMessage}</label>
			</div>
			<div class="flex-none">
				<button class="btn btn-sm btn-ghost mr-2" on:click={() => (showToast = false)}>Ok</button>
			</div>
		</div>
	</div>
{/if}
