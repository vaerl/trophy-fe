import { goto } from '$app/navigation';
import type { StatusResponse } from './data';
import { loginStore } from './stores';
import { credentialFetch } from './util';

/**
 * Tries to log in the current user by POSTing username and password to the backend(which is sourced from the environment).
 * Also directly calls {@link checkAuth} to update the {@link loginState}.
 * @param username
 * @param password
 */
export async function login(name: string, password: string) {
	await credentialFetch(import.meta.env.VITE_BACKEND_URL + '/login', {
		method: 'POST',
		body: JSON.stringify({ name: name, password: password })
	});
	checkAuth();
}

export async function checkAuth() {
	const value = await credentialFetch(import.meta.env.VITE_BACKEND_URL + '/status', {
		method: 'GET'
	});
	const response: StatusResponse = await value.json();

	if (response.status) {
		console.debug('User is logged in, updating store.');
		loginStore.set(true);
	} else {
		console.warn('User is not logged in!');
		loginStore.set(false);
	}
}

export async function logout() {
	await credentialFetch(import.meta.env.VITE_BACKEND_URL + '/logout', {
		method: 'POST'
	});
	console.debug(`Logged out user.`);
	goto('/');
}
