import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	return {
		user: {
			avatarUrl: 'urls',
			username: 'namestuff',
			joinDate: 'dates',
			badges: [
				{
					icon: 'icons',
					description: 'descriptions'
				}
			]
		},
		games: [
			{
				result: 'hkjsdf',
				gameName: 'hkjsdf',
				playedAt: 'hkjsdf',
				score: 'hkjsdf',
				playTime: 'hkjsdf',
				xpEarned: 'hkjsdf',
				achievements: 'hkjsdf'
			}
		],
		stats: 'STATS!!!'
	};
};
