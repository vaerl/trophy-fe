import { writable } from 'svelte/store';
import type { Subscriber, Unsubscriber, Updater, Writable } from 'svelte/store';
import { MessageType, type Message } from './model';
import { credentialFetch } from './util';

export class HttpStore<T> implements Writable<T> {
	private store: Writable<T>;
	public loading = writable<boolean>(false);

	constructor(
		initial: T,
		private message: Writable<Message>
	) {
		this.store = writable<T>(initial);
	}

	set(value: T): void {
		return this.store.set(value);
	}

	update(updater: Updater<any>): void {
		return this.store.update(updater);
	}

	subscribe(run: Subscriber<T>, invalidate?: (value?: any) => void): Unsubscriber {
		return this.store.subscribe(run, invalidate);
	}

	async request(
		method: string,
		path: string,
		// TODO I could type this, see the bookmark
		baseUrl: unknown = import.meta.env.VITE_BACKEND_URL,
		params?: unknown
	) {
		// before we fetch, clear out previous errors and set `loading` to `true`
		this.loading.set(true);

		const body = params ? JSON.stringify(params) : undefined;

		// execute fetch
		const response = await credentialFetch(baseUrl + '/' + path, {
			method,
			body
		});

		// pull out json body
		const json = await response.json();

		if (response.ok) {
			// update the store, which will cause subscribers to be notified
			this.store.set(json);
		} else {
			// response failed, set error and loading
			this.message.set({
				type: MessageType.Error,
				message: `Encountered error while fetching: ${json.errors}`
			});
		}
		this.loading.set(false);
	}

	async get(path: string) {
		await this.request('GET', path);
	}

	async post(path: string, baseUrl: string = undefined, params?: unknown) {
		await this.request('POST', path, baseUrl, params);
	}

	async put(path: string, baseUrl: string = undefined, params?: unknown) {
		await this.request('PUT', path, baseUrl, params);
	}

	async delete(path: string, baseUrl: string = undefined, params?: unknown) {
		await this.request('DELETE', path, baseUrl, params);
	}
}
