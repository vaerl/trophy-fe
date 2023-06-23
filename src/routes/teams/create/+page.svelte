<script lang="ts">
	import Breadcrumbs from '../../../components/Breadcrumbs.svelte';
	import Create from '../../../components/details/Create.svelte';
	import { TeamGender, type Team } from '../../../lib/model';
	import type { Path } from '../../../lib/data';

	let team: Team = {
		id: -1,
		trophy_id: -1,
		name: '',
		gender: TeamGender.Female,
		points: -1
	};

	let paths: Path[] = [{ name: 'Teams', path: '/teams' }];
</script>

<Breadcrumbs current="Neues Team" {paths} />
<Create edit={false} item={team} type="team" />
