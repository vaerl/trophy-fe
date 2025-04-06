<script>
	import { page } from '$app/state';
	import { yearStore } from '$lib/stores';
</script>

<div class="absolute-center-x w-full text-center">
	<h1 class="font-extrabold text-4xl pb-4">
		{page.status}: {page.error?.message}
	</h1>
	<a href="/overview/pie?year={$yearStore}"
		><h2 class="font-bold link text-2xl">Zurück zur Übersicht</h2></a
	>
</div>
