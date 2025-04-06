import { type User as FirebaseUser } from 'firebase/auth';

enum AvatarColor {
	Blue = 'blue',
	Green = 'green',
	Red = 'red',
	Purple = 'purple',
	Orange = 'orange'
}

const AvatarColorClasses: Record<string, string> = {
	blue: 'bg-blue-400',
	green: 'bg-green-400',
	red: 'bg-red-400',
	purple: 'bg-purple-400',
	orange: 'bg-orange-400'
};

export type UserData = {
	avatarColor: AvatarColor;
	username: string;
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

export type Game = {
	result: string;
	gameName: string;
	playedAt: string;
	score: string;
	playTime: string;
	xpEarned: string;
	achievements: string;
};
