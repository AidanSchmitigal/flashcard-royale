import { get } from 'svelte/store';
import { updateUser, user } from './firebase';
import type { AvatarColor } from './types';

export const freeAvatars = [
	{ id: 'blue', label: 'Blue', class: 'bg-blue-400' },
	{ id: 'green', label: 'Green', class: 'bg-green-400' },
	{ id: 'red', label: 'Red', class: 'bg-red-400' },
	{ id: 'purple', label: 'Purple', class: 'bg-purple-400' },
	{ id: 'orange', label: 'Orange', class: 'bg-orange-400' }
];

export const unlockableAvatars = [
	{
		id: 'gradient1',
		label: 'Sunset',
		class: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500',
		requiredWins: 5
	},
	{
		id: 'gradient2',
		label: 'Ocean Wave',
		class: 'bg-gradient-to-br from-blue-400 via-teal-400 to-green-400',
		requiredWins: 10
	},
	{
		id: 'gradient3',
		label: 'Mystic Night',
		class: 'bg-gradient-to-tr from-indigo-700 via-purple-600 to-pink-600',
		requiredWins: 20
	}
];

// 🆕 AvatarColorClasses – used in header, profile, etc.
export const AvatarColorClasses: Record<string, string> = {
	blue: 'bg-blue-400',
	green: 'bg-green-400',
	red: 'bg-red-400',
	purple: 'bg-purple-400',
	orange: 'bg-orange-400',
	gradient1: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500',
	gradient2: 'bg-gradient-to-br from-blue-400 via-teal-400 to-green-400',
	gradient3: 'bg-gradient-to-tr from-indigo-700 via-purple-600 to-pink-600'
};

export async function changeAvatarColor(color: AvatarColor) {
	const userData = get(user);
	if (!userData) return;

	const isFree = freeAvatars.find((a) => a.id === color);
	const isUnlocked = unlockableAvatars.find(
		(a) => a.id === color && (userData.stats.gamesWon ?? 0) >= a.requiredWins
	);

	if (isFree || isUnlocked) {
		userData.avatarColor = color;

		// ✅ Persist to Firestore
		await updateUser(userData.uid, { avatarColor: color });

		// ✅ Update the local store so it's reactive
		user.set({ ...userData, avatarColor: color });
	}
}
