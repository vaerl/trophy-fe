<script lang="ts">
	import { logout } from '$lib/auth';
	import Logout from '../icons/Logout.svelte';
</script>

<button class="h-min cursor-pointer" onclick={logout}>
	<Logout></Logout>
</button>
