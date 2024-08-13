# Loading

Some components, like the pie-chart in `/overview` use SvelteKit's built in `#await`-block to signal a loading-state.

This makes sense in some cases, but did not play nice with `DataTables` so I've omitted loading for tables and details (for now).
The `Readable` of `DataTables` did not work correctly when `await`ed this way.
