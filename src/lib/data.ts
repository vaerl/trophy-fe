export type ApiResponse<T> = T | ErrorResponse;

export interface ErrorResponse {
	error: string;
}

export interface StatusResponse {
	status: boolean;
}

export type Column = { id: string; name: string };
export type Field = {
	id: string;
	name: string;
	type: 'gender' | 'kind' | 'string' | 'number' | 'role';
};

export type Path = { path: string; name: string };

export type DataType = 'game' | 'team' | 'user';

export type OutcomeStatus = 'open' | 'done';
