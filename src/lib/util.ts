import { TeamGender, type Data } from './model';

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

export function localizeGender(gender: TeamGender): string {
	switch (gender) {
		case TeamGender.Female: {
			return 'weiblich';
		}
		case TeamGender.Male: {
			return 'männlich';
		}
		default: {
			return 'Unbekannt';
		}
	}
}

// TODO adjust return-type
export function getNameById(items: Data[], id: number): Data {
	let res = items.find((i) => i.id == id);
	return res == undefined ? { name: 'Could not find element.', id: -1 } : res;
}
