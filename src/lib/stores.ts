import { derived, writable } from 'svelte/store';
import type { Message } from './model';
import { getYear } from './util';

export const messageStore = writable<Message>();
export const yearStore = writable<string>(getYear());
export const paramStore = derived(yearStore, ($year) => `?year=${$year}`);
