import { TeamGender, GameKind, LogLevel, UserRole } from './model';

export function localize(input: string): string {
	switch (input) {
		case TeamGender.Male:
			return 'männlich';
		case TeamGender.Female:
			return 'weiblich';
		case GameKind.Points:
			return 'Punkte';
		case GameKind.Time:
			return 'Zeit';
		case LogLevel.Debug:
			return 'Debug';
		case LogLevel.Info:
			return 'Info';
		case LogLevel.Important:
			return 'Important';
		case UserRole.Admin:
			return 'Admin';
		case UserRole.Referee:
			return 'Schiedsrichter';
		case UserRole.Visualizer:
			return 'Visualisierung';
		default:
			return input;
	}
}
