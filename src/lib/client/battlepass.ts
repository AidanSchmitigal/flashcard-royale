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

export async function changeAvatarColor(color: AvatarColor) {
	const userData = get(user);
	if (userData == null) return;

	const isFree = freeAvatars.find((a) => a.id === color);
	const isUnlocked = unlockableAvatars.find(
		(a) => a.id === color && (userData.stats.gamesWon ?? 0) >= a.requiredWins
	);

	if (isFree || isUnlocked) {
		userData.avatarColor = color;

		updateUser(userData.uid, {
			avatarColor: color
		});
	}
}
