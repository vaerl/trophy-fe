import { isGame, isTeam, type Game, type Outcome, type Team, type User } from './model';
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

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const doneOutcomeFilter = (o: Outcome) => o.data;
export const openOutcomeFilter = (o: Outcome) => !o.data;

export function linkPrefix(item: Team | Game | User) {
	if (isTeam(item)) {
		return 'teams';
	}

	if (isGame(item)) {
		return 'games';
	}

	return 'users';
}

export function typeName(item: Team | Game | User) {
	if (isTeam(item)) {
		return 'Team';
	}

	if (isGame(item)) {
		return 'Spiel';
	}

	return 'Nutzer';
}

// reusable function to set focus
export function autofocus(node: HTMLElement) {
	node.focus();
}
