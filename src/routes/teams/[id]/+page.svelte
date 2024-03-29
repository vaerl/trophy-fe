<script lang="ts">
	import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables';

	export let data;

	const openOutcomeHandler = new DataHandler(
		data.outcomes.filter((o) => !o.data),
		{ rowsPerPage: 10 }
	);
	const openOutcomes = openOutcomeHandler.getRows();

	const doneOutcomeHandler = new DataHandler(
		data.outcomes.filter((o) => o.data),
		{ rowsPerPage: 10 }
	);
	const doneOutcomes = doneOutcomeHandler.getRows();
	// TODO add click-listener for row on both tables
</script>

<div class="absolute-center-x left-1/2 pt-6">
	<div class="tooltip" data-tip="Zum Bearbeiten klicken.">
		<a href={`/teams/${data.team.id}/edit`}>
			<div class="stats border">
				<div class="stat place-items-center">
					<div class="stat-title">Name</div>
					<div class="stat-value">{data.team.name}</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">Trophy-ID</div>
					<div class="stat-value">{data.team.trophy_id}</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">Typ</div>
					<div class="stat-value">{data.team.gender}</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">Punkte</div>
					<div class="stat-value text-primary">{data.team.points}</div>
				</div>
			</div></a
		>
	</div>
</div>

<div class="flex flex-row h-full pt-20 pb-6 px-4">
	<div class="w-1/2 h-full flex flex-col">
		<h1 class="text-2xl font-bold underline text-center">Offene Spiele</h1>

		<Datatable handler={openOutcomeHandler}>
			<table class="table table-zebra">
				<thead>
					<tr>
						<Th handler={openOutcomeHandler} orderBy="game_trophy_id">Trophy-ID</Th>
						<Th handler={openOutcomeHandler} orderBy="game_name">Spiel</Th>
					</tr>
					<tr>
						<ThFilter handler={openOutcomeHandler} filterBy="game_trophy_id" />
						<ThFilter handler={openOutcomeHandler} filterBy="game_name" />
					</tr>
				</thead>

				<tbody>
					{#each $openOutcomes as row}
						<tr>
							<td>
								{row.game_trophy_id}
							</td>
							<td>
								{row.game_name}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</Datatable>
	</div>

	<div class="divider divider-horizontal"></div>

	<div class="w-1/2 h-full flex flex-col">
		<h1 class="text-2xl font-bold underline text-center">Fertige Spiele</h1>
		<Datatable handler={doneOutcomeHandler}>
			<table class="table table-zebra">
				<thead>
					<tr>
						<Th handler={doneOutcomeHandler} orderBy="game_trophy_id">Trophy-ID</Th>
						<Th handler={doneOutcomeHandler} orderBy="game_name">Spiel</Th>
						<Th handler={doneOutcomeHandler} orderBy="data">Wert</Th>
					</tr>
					<tr>
						<ThFilter handler={doneOutcomeHandler} filterBy="game_trophy_id" />
						<ThFilter handler={doneOutcomeHandler} filterBy="game_name" />
						<ThFilter handler={doneOutcomeHandler} filterBy="data" />
					</tr>
				</thead>

				<tbody>
					{#each $doneOutcomes as row}
						<tr>
							<td>
								{row.game_trophy_id}
							</td>
							<td>
								{row.game_name}
							</td>
							<td>
								{row.data}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</Datatable>
	</div>
</div>
