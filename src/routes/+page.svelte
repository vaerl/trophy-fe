<script lang="ts">
	import { checkAuth, logout } from '../lib/auth';
	import {
		finishedGames,
		finishedTeams,
		games,
		messageStore,
		pendingGames,
		pendingTeams,
		previousMessageStore,
		teams
	} from '../lib/stores';
	import Loader from '../components/Loader.svelte';
	import PieChart from '../components/charts/PieChart.svelte';
	import BarChart from '../components/charts/BarChart.svelte';
	import RightArrow from '../components/icons/RightArrow.svelte';
	import LeftArrow from '../components/icons/LeftArrow.svelte';
	import { MessageType, type Message } from '$lib/model';
	import { onDestroy } from 'svelte';
	import UserIcon from '../components/icons/UserIcon.svelte';
	import Info from '../components/icons/Info.svelte';
	import Logout from '../components/icons/Logout.svelte';

	enum Content {
		PieChart,
		BarChart
	}

	let content = Content.PieChart;

	checkAuth();

	$: gamesLoading = games.loading;
	$: teamsLoading = teams.loading;

	$: pendingTeamsLoading = pendingTeams.loading;
	$: finishedTeamsLoading = finishedTeams.loading;

	$: pendingGamesLoading = pendingGames.loading;
	$: finishedGamesLoading = finishedGames.loading;

	$: done =
		$pendingTeams.length == 0 &&
		$pendingGames.length == 0 &&
		$finishedTeams.length > 0 &&
		$finishedGames.length > 0;

	teams.get('teams');
	games.get('games');

	pendingTeams.get('teams/pending');
	finishedTeams.get('teams/finished');

	pendingGames.get('games/pending');
	finishedGames.get('games/finished');

	function switchContent() {
		if (content == Content.PieChart) {
			content = Content.BarChart;
		} else {
			content = Content.PieChart;
		}
	}

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

<!-- TODO there has to be a better way to do this! Maybe an array? -->
{#if $teamsLoading || $gamesLoading || $pendingTeamsLoading || $finishedTeamsLoading || $pendingGamesLoading || $finishedGamesLoading}
	<Loader />
{:else if content == Content.PieChart}
	<div class="flex flex-row justify-evenly h-96">
		<PieChart name="Teams" open={$pendingTeams.length} done={$finishedTeams.length} link="/teams" />
		<PieChart
			name="Spiele"
			open={$pendingGames.length}
			done={$finishedGames.length}
			link="/games"
		/>
		<button class="absolute right-10 top-1/2 cursor-pointer" on:click={() => switchContent()}>
			<RightArrow size={20} />
		</button>
	</div>
{:else}
	<div class="flex flex-row justify-evenly h-96">
		<BarChart games={$games} name="Fertige Teams" totalTeamsAmount={$teams.length} />
		<button class="absolute left-10 top-1/2 cursor-pointer" on:click={() => switchContent()}>
			<LeftArrow size={20} />
		</button>
	</div>
{/if}

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
