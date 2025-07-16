<script lang="ts">
	import { Datatable, TableHandler, ThFilter, ThSort } from '@vincjo/datatables';
	import type { Outcome } from '$lib/model';
	import Loader from '../blocks/Loader.svelte';
	import { doneOutcomeFilter, openOutcomeFilter } from '$lib/util';

	type Props = {
		fields: (keyof Outcome)[];
		target: 'done' | 'open';
		outcomes: Promise<Outcome[]>;
		showOutcomeModal: (outcome: Outcome) => void;
	};

	let { fields, target, outcomes, showOutcomeModal: showModal }: Props = $props();

	const targetFilter = target == 'done' ? doneOutcomeFilter : openOutcomeFilter;
	const columnNames: { [Property in keyof Outcome]: string } = {
		data: 'Wert',
		game_id: 'Spiel-ID',
		game_kind: 'Spiel-Typ',
		game_name: 'Spiel',
		game_trophy_id: 'Trophy-ID',
		point_value: 'Punkte-Wert',
		team_id: 'Team-ID',
		team_name: 'Team',
		team_trophy_id: 'Trophy-ID'
	};

	let table = $derived.by(async () => {
		let o = await outcomes;
		return new TableHandler(o.filter(targetFilter, { rowsPerPage: 100 }));
	});
</script>

{#await table}
	<Loader></Loader>
{:then table}
	<Datatable {table}>
		<table>
			<thead>
				<tr>
					{#each fields as field}
						<ThSort
							{table}
							{field}
							direction={field == 'game_trophy_id' || field == 'team_trophy_id' ? 'asc' : undefined}
							>{columnNames[field]}</ThSort
						>
					{/each}
				</tr>
				<tr>
					{#each fields as field}
						<ThFilter {table} {field} />
					{/each}
				</tr>
			</thead>

			<tbody>
				{#each table.rows as row}
					<tr>
						{#each fields as field}
							<td onclick={() => showModal(row)} class="cursor-pointer">
								{row[field]}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</Datatable>
{/await}
