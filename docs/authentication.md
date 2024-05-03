# Authentication

There is no comparable mechanism to Angular's guards.
The closest you can come is using [hooks](https://kit.svelte.dev/docs/hooks), but they're only supported for the server.

Because of these issues, pages are shown for a bit before navigating to the other page.

## Redirecting to `/login`

The top-level `+layout.svelte` uses `goto` to navigate to `/login` if the user is not logged in.
This protects all nested pages.

## Redirecting away from `/login`

If the user is already logged in but somehow navigates to `/login`, we use `goto` to navigate to `/overview/pie`.
This could use `beforeNavigate`, if we only `goto` `/login`.
