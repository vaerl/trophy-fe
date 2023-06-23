<script lang="ts">
	import { localize } from '$lib/localize';
	import { LogLevel, type User } from '$lib/model';
	import { logs, users } from '$lib/stores';
	import Breadcrumbs from '../../components/Breadcrumbs.svelte';
	logs.get('history');
	users.get('users');

	let logLevels: LogLevel[] = [LogLevel.Info, LogLevel.Important];

	$: logSubset = $logs
		// only show the last 1000 entries
		.slice(-2000)
		// remove everything not included in the logLevel-array
		.filter((e) => logLevelEnabled(e.log_level))
		// sort by id
		.sort((a, b) => b.id - a.id);

	$: logLevelEnabled = (level: LogLevel) => {
		return logLevels.includes(level);
	};

	function toggleLogLevel(level: LogLevel) {
		if (logLevelEnabled(level)) {
			logLevels.splice(logLevels.indexOf(level), 1);
		} else {
			logLevels.push(level);
		}
		logLevels = logLevels;
	}

	function getUser(id: number): User {
		return $users.filter((u) => u.id == id)[0];
	}

	function getColor(level: LogLevel): string {
		switch (level) {
			case LogLevel.Debug:
				return 'neutral';
			case LogLevel.Info:
				return 'warning';
			case LogLevel.Info:
				return 'error';
			default:
				return 'error';
		}
	}
</script>

<Breadcrumbs current="Logs" paths={[]} />
<div class="flex flex-col mt-4">
	<div class="flex flex-row justify-end">
		<div>
			<span
				class="badge badge-accent cursor-pointer"
				class:badge-outline={!logLevelEnabled(LogLevel.Important)}
				on:click={() => toggleLogLevel(LogLevel.Important)}>Important</span
			>
			<span
				class="badge badge-accent cursor-pointer"
				class:badge-outline={!logLevelEnabled(LogLevel.Info)}
				on:click={() => toggleLogLevel(LogLevel.Info)}>Info</span
			>
			<span
				class="badge badge-accent cursor-pointer"
				class:badge-outline={!logLevelEnabled(LogLevel.Debug)}
				on:click={() => toggleLogLevel(LogLevel.Debug)}>Debug</span
			>
		</div>
	</div>
	<table class="table table-zebra last:w-full mt-4">
		<thead>
			<tr>
				<th>Id</th>
				<th>Nutzer</th>
				<th>Timestamp</th>
				<th>Log-Level</th>
				<th>Aktion</th>
			</tr>
		</thead>
		<tbody>
			{#each logSubset as log}
				<tr>
					<th>{log.id}</th>
					<td>{getUser(log.user_id).name}</td>
					<td>{new Date(log.timestamp).toLocaleString()}</td>
					<td class={`text-${getColor(log.log_level)}`}>{localize(log.log_level)}</td>
					<td>{log.action}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="flex flex-row justify-end">
		<div>
			<span
				class="badge badge-accent cursor-pointer"
				class:badge-outline={!logLevelEnabled(LogLevel.Important)}
				on:click={() => toggleLogLevel(LogLevel.Important)}>Important</span
			>
			<span
				class="badge badge-accent cursor-pointer"
				class:badge-outline={!logLevelEnabled(LogLevel.Info)}
				on:click={() => toggleLogLevel(LogLevel.Info)}>Info</span
			>
			<span
				class="badge badge-accent cursor-pointer"
				class:badge-outline={!logLevelEnabled(LogLevel.Debug)}
				on:click={() => toggleLogLevel(LogLevel.Debug)}>Debug</span
			>
		</div>
	</div>
	<table class="table table-zebra last:w-full mt-4">
		<thead>
			<tr>
				<th>Id</th>
				<th>Nutzer</th>
				<th>Timestamp</th>
				<th>Log-Level</th>
				<th>Aktion</th>
			</tr>
		</thead>
		<tbody>
			{#each logSubset as log}
				<tr>
					<th>{log.id}</th>
					<td>{getUser(log.user_id).name}</td>
					<td>{new Date(log.timestamp).toLocaleString()}</td>
					<td class={`text-${getColor(log.log_level)}`}>{localize(log.log_level)}</td>
					<td>{log.action}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
