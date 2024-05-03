<script lang="ts">
	// copied from here: https://github.com/GeekyAnts/svelte-admin-dashboard/blob/master/src/components/Charts/DoughnutChart.svelte
	import { onMount } from 'svelte';
	// this has to be done like this: https://stackoverflow.com/questions/71030372/does-not-provide-an-export-named-tooltip-even-though-i-can-output-tooltip
	import Chart, { BarController, BarElement, Legend, LinearScale, Tooltip } from 'chart.js/auto';
	import { credentialFetch } from '../../lib/util';
	import type { Game, Team } from '$lib/model';
	import { goto } from '$app/navigation';

	export let games: Game[];
	export let totalTeamsAmount: number;
	export let id: string;
	const chartPrefix = 'bar-';
	const chartId = chartPrefix + id;

	Chart.register(BarController, BarElement, Tooltip, Legend, LinearScale);

	let barChart: Chart;

	function createBar() {
		barChart = new Chart(document.getElementById(chartId)! as HTMLCanvasElement, {
			type: 'bar',
			data: {
				labels: [],
				datasets: []
			},
			options: {
				onClick: (_event, elements, chart) => {
					const element = elements[0]; // use the first one
					const gameName = chart.data.labels![element.index];
					games.forEach((game) => {
						if (game.name == gameName) {
							goto(`./games/${game.id}`);
						}
					});
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
						max: totalTeamsAmount,
						ticks: {
							stepSize: 1
						}
					}
				}
			}
		});
	}

	let responses: Promise<Team[]>[] = [];
	for (let index = 0; index < games.length; index++) {
		const game = games[index];
		let response = credentialFetch(import.meta.env.VITE_BACKEND_URL + `/games/${game.id}/pending`, {
			method: 'GET'
		}).then((response) => response.json());
		responses.push(response);
	}
	Promise.all(responses).then((responses) => {
		// this check is necessary
		if (barChart != undefined) {
			barChart.data.labels = games.map((g) => g.name);
			barChart.data.datasets = [
				{
					label: 'Fertig',
					data: responses.map((r) => totalTeamsAmount - r.length),
					backgroundColor: '#009485'
				},
				{
					label: 'Offen',
					data: responses.map((r) => r.length),
					backgroundColor: '#ff5724'
				}
			];
			barChart.update();
		}
	});

	if (games.length > 0 && totalTeamsAmount > 0) {
		onMount(createBar);
	}
</script>

{#if games.length == 0 || totalTeamsAmount == 0}
	<h1 class="text-lg font-bold text-center">Momentan sind keine Daten verfügbar.</h1>
{:else}
	<!-- TODO there might be a better way to make the cursor a pointer -->
	<div class="w-1/2 cursor-pointer" on:click={() => goto('..')}>
		<canvas id={chartId} />
	</div>
{/if}
