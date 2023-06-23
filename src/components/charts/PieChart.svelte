<script lang="ts">
	// copied from here: https://github.com/GeekyAnts/svelte-admin-dashboard/blob/master/src/components/Charts/DoughnutChart.svelte
	import { onMount } from 'svelte';
	// this has to be done like this: https://stackoverflow.com/questions/71030372/does-not-provide-an-export-named-tooltip-even-though-i-can-output-tooltip
	import { goto } from '$app/navigation';
	import Chart, {
		ArcElement,
		CategoryScale,
		DoughnutController,
		Legend,
		Tooltip
	} from 'chart.js/auto';

	export let name: string;
	export let link: string;
	export let done: number;
	export let open: number;
	let total = open + done;
	let chart;

	Chart.register(DoughnutController, ArcElement, Tooltip, Legend, CategoryScale);

	function createDoughnut() {
		chart = new Chart(document.getElementById('doughnut-chart' + name)! as HTMLCanvasElement, {
			type: 'doughnut',
			data: {
				labels: ['Fertig', 'Offen'],
				datasets: [
					{
						label: name,
						data: [done, open],
						backgroundColor: ['#009485', '#ff5724']
					}
				]
			},
			options: {
				responsive: true
			}
		});
	}

	if (total > 0) {
		onMount(createDoughnut);
	}
</script>

{#if total == 0}
	<h1 class="text-lg font-bold text-center cursor-pointer" on:click={() => goto(link)}>
		Momentan sind keine <br />
		{name} angelegt.
	</h1>
{:else}
	<div class="relative cursor-pointer" on:click={() => goto(link)}>
		<h4 class="text-3xl text-center pb-4 font-bold">{name}</h4>
		<canvas id={'doughnut-chart' + name} />
		<div class="absolute top-1/2 w-full">
			<p class="text-center w-full font-extrabold stat-value">
				{total}
			</p>
			<p class="text-center w-full stat-desc">{name} insgesamt</p>
		</div>
	</div>
{/if}
