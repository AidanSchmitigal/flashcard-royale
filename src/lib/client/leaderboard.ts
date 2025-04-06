import { db } from '$lib/client/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export async function getTopScoringUsers(limit = 10) {
    try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        
        let users = usersSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name || 'Anonymous',
                gamesWon: data.gamesWon || 0
            };
        });
        
        // Sort users by gamesWon in descending order
        users.sort((a, b) => b.gamesWon - a.gamesWon);
        
        // Return only the top users based on limit
        return users.slice(0, limit);
    } catch (error) {
        console.error("Error fetching top users:", error);
        return [];
    }
}

export async function getUserRank(userId: string) {
    try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        
        // Get all users and their gamesWon count
        let users = usersSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name || 'Anonymous',
                gamesWon: data.gamesWon || 0
            };
        });
        
        // Sort by gamesWon in descending order
        users.sort((a, b) => b.gamesWon - a.gamesWon);
        
        // Find the user's position in the sorted list
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex !== -1) {
            const userDoc = await getDoc(doc(db, 'users', userId));
            const userData = userDoc.data();
            
            return {
                rank: userIndex + 1,
                name: userData?.name || 'Anonymous',
                gamesWon: userData?.gamesWon || 0
            };
        }
        
        return null;
    } catch (error) {
        console.error("Error getting user rank:", error);
        return null;
    }
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