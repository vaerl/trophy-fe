export interface CreateTeam {
	name: string;
	trophy_id: number;
	gender: TeamGender;
}

export interface Team extends CreateTeam {
	id: number;
	points: number;
}

export enum TeamGender {
	Male = 'male',
	Female = 'female'
}

export interface Outcome {
	game_id: number;
	game_trophy_id: number;
	game_name: string;
	game_kind: GameKind;
	team_id: number;
	team_trophy_id: number;
	team_name: string;
	data: string | null;
	point_value: number;
}

export interface CreateGame {
	trophy_id: number;
	kind: GameKind;
	name: string;
}

export interface Game extends CreateGame {
	id: number;
	locked: boolean;
}

export interface GameWithPending extends Game {
	pendingTeams: number;
}

export enum GameKind {
	Points = 'points',
	Time = 'time'
}

export interface Message {
	type: MessageType;
	message: String;
}

// these correspond to DaisyUI's alert-classes so we can re-use them to color the alerts.
export enum MessageType {
	Error = 'error',
	Info = 'info',
	Warn = 'warn',
	Success = 'success'
}

export enum UserRole {
	Admin = 'admin',
	Referee = 'referee',
	Visualizer = 'visualizer'
}

export interface User extends CreateUser {
	id: number;
	game_name?: string;
}

export interface CreateUser {
	name: string;
	password: string;
	role: UserRole;
	game_id?: number;
}

export enum LogLevel {
	Debug = 'debug',
	Info = 'info',
	Important = 'important'
}

export interface History {
	id: number;
	user_id: number;
	user_name: string;
	timestamp: Date;
	log_level: LogLevel;
	action: string;
}
