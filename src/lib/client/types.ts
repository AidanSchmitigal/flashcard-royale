import { type User as FirebaseUser } from 'firebase/auth';

export enum AvatarColor {
	Blue = 'blue',
	Green = 'green',
	Red = 'red',
	Purple = 'purple',
	Orange = 'orange'
}

export const AvatarColorClasses: Record<AvatarColor, string> = {
	[AvatarColor.Blue]: 'bg-blue-400',
	[AvatarColor.Green]: 'bg-green-400',
	[AvatarColor.Red]: 'bg-red-400',
	[AvatarColor.Purple]: 'bg-purple-400',
	[AvatarColor.Orange]: 'bg-orange-400'
};

export type UserData = {
	avatarColor: AvatarColor;
	badges: Badge[];
	stats: Stats;
};

export type Stats = {
	xp: number;
	level: number;
	gamesPlayed: number;
	gamesWon: number;
	gamesLost: number;
	gamesDraw: number;
};

export type User = FirebaseUser & UserData;

export type Badge = {
	icon: string;
	description: string;
};

// export type Game = {
// 	result: string;
// 	gameName: string;
// 	playedAt: string;
// 	score: string;
// 	playTime: string;
// 	xpEarned: string;
// 	achievements: string;
// };
