import { ref, get, set, update, query, orderByChild, limitToLast } from "firebase/database";
import { rtdb } from './firebase'; 

export async function getTopScoringUsers(limit: number): Promise<{ uid: string; name: string; score: number }[]> {
	const leaderboardRef = query(ref(rtdb, 'leaderboard'), orderByChild('score'), limitToLast(limit));
	const snapshot = await get(leaderboardRef);

	if (!snapshot.exists()) return [];

	const data = snapshot.val();
	const users = Object.entries(data).map(([uid, value]: [string, any]) => ({
		uid,
		name: value.name ?? 'Unknown',
		score: value.score ?? 0
	}));

	return users.sort((a, b) => b.score - a.score);
}

export async function getUserRank(username: string): Promise<{ rank: number, score: number, gamesWon: number } | null> {
	const leaderboardRef = query(ref(db, 'leaderboard'), orderByChild('score'));
	const snapshot = await get(leaderboardRef);

	if (!snapshot.exists()) return null;

	const data = snapshot.val();
	const users = Object.entries(data)
		.map(([key, value]: [string, any]) => ({
			username: key,
			score: value.score,
			gamesWon: value.gamesWon ?? 0,
		}))
		.sort((a, b) => b.score - a.score);

	const rank = users.findIndex((user) => user.username === username);

	if (rank === -1) return null;

	return {
		rank: rank + 1,
		score: users[rank].score,
		gamesWon: users[rank].gamesWon,
	};
}

// Function to add games won for a user
export async function addGameWin(username: string): Promise<void> {
    const userRef = ref(db, `leaderboard/${username}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
        const userData = snapshot.val();
        const updatedData = {
            gamesWon: (userData.gamesWon || 0) + 1,
            score: (userData.score || 0) + 10, // Increment score by 10 for each win
        };
        await update(userRef, updatedData);
    } else {
        const newUserData = {
            gamesWon: 1,
            score: 10,
        };
        await set(userRef, newUserData);
    }
}