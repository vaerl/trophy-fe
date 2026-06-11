<script lang="ts">
	import { messageStore } from '$lib/stores';
	import '../app.css';
	import type { LayoutProps } from './$types';
	import { MessageType, type Message } from '$lib/model';
	import { onDestroy } from 'svelte';

	let { children }: LayoutProps = $props();

	// NOTE I include the switcher here to show errors during login.
	// Logged out users are only able to produce login-errors, so this should be fine.
	let toast: Message | undefined = $state(undefined);
	const unsub = messageStore.subscribe((message) => {
		// Ignore the initial state of 'undefined' - I mainly still have this subscription
		// because of the setTimeout-function. Otherwise, we could simply use messageStore directly.
		if (message) {
			toast = message;
			setTimeout(() => (toast = undefined), 30000);
		}
	});

	// should be unnecessary since we basically do this globally
	onDestroy(unsub);
</script>

{@render children()}

{#if toast}
	<div
		class="alert absolute bottom-4 right-4 w-auto shadow-lg"
		class:alert-info={toast.type === MessageType.Info}
		class:alert-success={toast.type === MessageType.Success}
		class:alert-warning={toast.type === MessageType.Warn}
		class:alert-error={toast.type === MessageType.Error}
		role="alert"
	>
		<span>{toast.message}</span>
		<button class="btn btn-sm btn-ghost" onclick={() => (toast = undefined)}>Ok</button>
	</div>
{/if}
