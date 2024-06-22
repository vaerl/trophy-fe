import { yearStore } from './stores';

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
