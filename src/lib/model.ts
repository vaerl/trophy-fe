export interface Data {
	id: number;
	name: string;
}

export interface Team extends Data {
	trophy_id: number;
	gender: TeamGender;
	points: number;
}

export enum TeamGender {
	Male = 'male',
	Female = 'female'
}

export interface Outcome {
	game_id: number;
	game_trophy_id: number;
	team_id: number;
	team_trophy_id: number;
	data: string | null;
	point_value: number;
}

export interface Game extends Data {
	trophy_id: number;
	kind: GameKind;
	locked: boolean;
}

export enum GameKind {
	Points = 'points',
	Time = 'time'
}

export class Message {
	public timestamp: Date;

	constructor(public type: MessageType, public message: string) {
		this.timestamp = new Date();
	}

	public isAfter(message: Message): boolean {
		return this.timestamp > message.timestamp;
	}
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

export interface User extends Data {
	password: string;
	role: UserRole;
	game_id?: number;
}

export enum LogLevel {
	Debug = 'debug',
	Info = 'info',
	Important = 'important'
}

export interface History extends Data {
	user_id: number;
	timestamp: Date;
	log_level: LogLevel;
	action: string;
}
