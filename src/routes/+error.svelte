<script>
	import { page } from '$app/state';
	import ErrorComponent from '$lib/components/ErrorComponent.svelte';

	// pass an error the ErrorComponent can handle
	const error = {
		status: page.status,
		body: {
			message: page.error?.message ?? 'No details provided.'
		}
	};
</script>

<ErrorComponent {error} />
