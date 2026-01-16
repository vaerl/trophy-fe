<script lang="ts">
	// copied from here: https://github.com/GeekyAnts/svelte-admin-dashboard/blob/master/src/components/Charts/DoughnutChart.svelte
	import { onMount } from 'svelte';
	// this has to be done like this: https://stackoverflow.com/questions/71030372/does-not-provide-an-export-named-tooltip-even-though-i-can-output-tooltip
	import Chart, { BarController, BarElement, Legend, LinearScale, Tooltip } from 'chart.js/auto';
	import type { GameWithPending } from '$lib/model';
	import { goto } from '$app/navigation';

	interface Props {
		games: GameWithPending[];
		teams: number;
		id: string;
	}

	let props: Props = $props();
	let { games, teams, id } = $state(props);

	const chartPrefix = 'bar-';
	const chartId = chartPrefix + id;

	Chart.register(BarController, BarElement, Tooltip, Legend, LinearScale);

	function createBar() {
		new Chart(document.getElementById(chartId)! as HTMLCanvasElement, {
			type: 'bar',
			data: {
				labels: games.map((g) => g.name),
				datasets: [
					{
						label: 'Fertig',
						data: games.map((g) => teams - g.pendingTeams),
						backgroundColor: '#009485'
					},
					{
						label: 'Offen',
						data: games.map((g) => g.pendingTeams),
						backgroundColor: '#ff5724'
					}
				]
			},
			options: {
				onClick: (_event, elements, chart) => {
					const element = elements[0]; // use the first one
					const gameName = chart.data.labels![element.index];
					games.forEach((game) => {
						if (game.name == gameName) {
							goto(`/games/${game.id}`);
						}
					});
				},
				// taken from here: https://youtu.be/Uj_I2_7o0No?t=682
				// NOTE we have to convince TypeScript by specifying any
				onHover: (event: any, chartElement) => {
					event.native!.target!.style.cursor = chartElement[0] ? 'pointer' : 'default';
				},
				plugins: {
					legend: {
						labels: {
							font: {
								size: 16
							}
						}
					}
				},
				responsive: true,
				scales: {
					x: {
						stacked: true,
						ticks: {
							font: {
								size: 20
							}
						}
					},
					y: {
						stacked: true,
						beginAtZero: true,
						max: teams,
						ticks: {
							stepSize: 1
						}
					}
				}
			}
		});
	}

	if (games.length > 0 && teams > 0) {
		onMount(createBar);
	}
</script>

{#if games.length == 0 || teams == 0}
	<h1 class="text-lg font-bold text-center">Momentan sind keine Daten verfügbar.</h1>
{:else}
	<div class="w-3/4">
		<canvas id={chartId}></canvas>
	</div>
{/if}
