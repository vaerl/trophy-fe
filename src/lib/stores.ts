import { writable } from 'svelte/store';
import type { Message } from './model';

export const messageStore = writable<Message>();
