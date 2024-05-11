import { goto } from '$app/navigation';
import { credentialFetch } from './util';

/**
 * Tries to log in the current user by POSTing username and password to the backend(which is sourced from the environment).
 * Also directly calls {@link checkAuth} to update the {@link loginState}.
 * @param username
 * @param password
 */
export async function login(name: string, password: string) {
	await credentialFetch(import.meta.env.VITE_BACKEND_URL + '/user/login', {
		method: 'POST',
		body: JSON.stringify({ name: name, password: password })
	});
	checkAuth();
}

/**
 * Check if the current user is logged in.
 * @returns true if the user is logged in
 */
export async function checkAuth() {
	const value = await credentialFetch(import.meta.env.VITE_BACKEND_URL + '/user/status', {
		method: 'GET'
	});
	const response = await value.json();
	return response.status;
}

/**
 * Log out the current user.
 */
export async function logout() {
	await credentialFetch(import.meta.env.VITE_BACKEND_URL + '/logout', {
		method: 'POST'
	});
	console.debug('Logged out user.');
	goto('/login');
}
