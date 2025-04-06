import { db } from '$lib/client/firebase';
import { collection, getDocs, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

export async function getTopScoringUsers(limit = 10) {
    try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        
        let users = usersSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.displayName || data.email || 'Anonymous',
                gamesWon: data.stats?.gamesWon || 0
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
                name: data.displayName || data.email || 'Anonymous',
                gamesWon: data.stats?.gamesWon || 0
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
                name: userData?.displayName || userData?.email || 'Anonymous',
                gamesWon: userData?.stats?.gamesWon || 0
            };
        }
        
        return null;
    } catch (error) {
        console.error("Error getting user rank:", error);
        return null;
    }
}

// Function to add games won for a user
export async function addGameWin(userId: string): Promise<void> {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const currentStats = userData.stats || {
                xp: 0,
                level: 1,
                gamesPlayed: 0,
                gamesWon: 0,
                gamesLost: 0,
                gamesDraw: 0
            };
            
            // Update the stats
            const updatedStats = {
                ...currentStats,
                gamesWon: (currentStats.gamesWon || 0) + 1,
                gamesPlayed: (currentStats.gamesPlayed || 0) + 1,
                xp: (currentStats.xp || 0) + 10 // Add XP for winning
            };
            
            await updateDoc(userDocRef, { stats: updatedStats });
        } else {
            console.error("User document does not exist");
        }
    } catch (error) {
        console.error("Error updating game win:", error);
    }
}