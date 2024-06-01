import { browser } from '$app/environment';
import { yearStore } from './stores';

/**
 * Small wrapper around fetch. Sets the content-type and specifies withCredentials: "true" as well as credentials: "include".
 * @param input Request-URL
 * @param init headers, body and other stuff
 * @returns the result of the fetch-call
 */
export function credentialFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
	return fetch(input, {
		headers: {
			'Content-Type': 'application/json',
			withCredentials: 'true'
		},
		credentials: 'include',
		...init
	});
}

export function isEnterKeyEvent(event: KeyboardEvent) {
	return event.key.toLowerCase() == 'enter';
}

export function isEscapeKeyEvent(event: KeyboardEvent) {
	return event.key.toLowerCase() == 'escape';
}

/**
 * Get the initial value for year. Used to set the value of {@link yearStore}.
 * @returns
 */
export function getYear(): string {
	let year = localStorage.getItem('year');

	if (year) {
		return year;
	}

	return new Date().getFullYear().toString();
}
