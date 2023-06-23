<script lang="ts">
	import { UserRole, type User } from '$lib/model';
	import Create from '../../../components/details/Create.svelte';

	let item: User = {
		id: -1,
		name: '',
		password: '',
		role: UserRole.Visualizer,
		game_id: -1
	};
</script>

<Create edit={false} {item} type="user" />
