<script lang="ts">
	import { checkAuth, logout } from '../lib/auth';
	import { messageStore, previousMessageStore } from '../lib/stores';
	import PieChart from '../components/charts/PieChart.svelte';
	import RightArrow from '../components/icons/RightArrow.svelte';
	import { MessageType, type Message } from '$lib/model';
	import { onDestroy } from 'svelte';
	import UserIcon from '../components/icons/UserIcon.svelte';
	import Info from '../components/icons/Info.svelte';
	import Logout from '../components/icons/Logout.svelte';

	export let data;
	// check if everything's done but also if there actually are things that should be done
	let done = data.pendingGames == 0 && data.pendingTeams == 0 && data.games > 0 && data.teams > 0;

	checkAuth();

	// message-toasts
	let showToast: boolean = false;
	let toastMessage: string = '';
	let toastClass: string = 'alert';

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

	function startEval() {
		console.info('Starting evaluation.');
		window.open(import.meta.env.VITE_BACKEND_URL + '/eval', '_blank')?.focus();
	}

	onDestroy(unsub);
</script>

<div class="flex flex-row justify-center w-full pb-20 pt-8">
	<div class="flex flex-col">
		<h1 class="text-5xl font-extrabold">Dashboard</h1>
		{#if done}
			<button class="btn btn-success mt-6" on:click={startEval}>Trophy auswerten</button>
		{/if}
	</div>
	<a class="btn btn-circle btn-ghost absolute right-16" href="users"> <UserIcon /> </a>
	<a class="btn btn-circle btn-ghost absolute right-2" href="logs"> <Info /> </a>
	<div class="tooltip tooltip-right absolute left-2" data-tip="Ausloggen">
		<button class="btn btn-circle btn-ghost" type="button" on:click={logout}> <Logout /> </button>
	</div>
</div>

<div class="flex flex-row justify-evenly h-96">
	<PieChart name="Teams" open={data.pendingGames} done={data.finishedTeams} link="/teams" />
	<PieChart name="Spiele" open={data.pendingGames} done={data.finishedGames} link="/games" />
	<a class="absolute right-10 top-1/2 cursor-pointer" href="/bar">
		<RightArrow size={20} />
	</a>
</div>

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

<!-- TODO test password-change, remove default password -->
<!-- TODO show a button for resetting the trophy -->
<!-- TODO make user removable even when IDs are used in history? -->

<!-- TODO add dashboard for final results -> maybe show arrow to the left or have new  path for that -->
<!-- -> also: show download on that page, don't download on 'auswerten' - just create the page -->
