<script lang="ts">
	import type { Path } from '../lib/data';

	export let paths: Path[];
	export let current: string;
</script>

<!--
  @component

  Expects an array containing all paths that should be displayed.
  `current` displays the current side without linking to it.
  Note that `/home` is automatically displayed.
-->

<div class="text-sm breadcrumbs ml-3">
	<ul>
		<li>
			<a href="/charts/pie">Übersicht</a>
		</li>
		{#each paths as path}
			<li>
				<a href={path.path}>{path.name}</a>
			</li>
		{/each}
		<li>{current}</li>
	</ul>
</div>
