import { writable } from 'svelte/store';
import { Message, MessageType, type History, type User } from './model';
import type { Game, Outcome, Team } from './model';
import { HttpStore } from './httpStore';

export const messageStore = writable<Message>();

// NOTE: I have to pass stores in the constructor - otherwise there will be a circular dependency!
// TEAM
export const teams = new HttpStore<Team[]>([], messageStore);
export const team = new HttpStore<Team>(undefined, messageStore);
export const pendingTeams = new HttpStore<Team[]>([], messageStore);
export const finishedTeams = new HttpStore<Team[]>([], messageStore);

// GAME
export const games = new HttpStore<Game[]>(undefined, messageStore);
export const game = new HttpStore<Game>(undefined, messageStore);
export const pendingGames = new HttpStore<Game[]>([], messageStore);
export const finishedGames = new HttpStore<Game[]>([], messageStore);

// OUTCOME
export const outcome = new HttpStore<Outcome>(undefined, messageStore);
export const outcomes = new HttpStore<Outcome[]>(undefined, messageStore);

// USERS
export const user = new HttpStore<User>(undefined, messageStore);
export const users = new HttpStore<User[]>([], messageStore);

// MISC
export const searchValue = writable<string>('');
export const logs = new HttpStore<History[]>([], messageStore);
