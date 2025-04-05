import axios from 'axios';
import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

import fs from 'fs';


// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
}
const db = admin.firestore();

// Gemini API Key
const GEMINI_API_KEY = 'AIzaSyCIgomPMh9mI1CxfknDweyLykZM8db_6vQ';

// Function to calculate base damage
function calculateBaseDamage(): number {
    return Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10 for base_dmg
}

// Function to get difficulty from Gemini
async function getDifficultyFromGemini(question: string): Promise<number> {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `Rank the difficulty of this question on a scale from 1 (easy) to 10 (hard): "${question}"`
                            }
                        ]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '1';
        const parsed = parseInt(text.match(/\d+/)?.[0] || '1');
        return Math.min(Math.max(parsed, 1), 10); // Ensure it's between 1–10
    } catch (err) {
        console.error('Error fetching difficulty from Gemini:', err);
        return 1; // Fallback difficulty
    }
}

// Function to process a full deck of flashcards
async function processFlashcards(inputJson: { Question: string; Answer: string }[]) {
    const deck: any[] = [];

    for (const card of inputJson) {
        const { Question, Answer } = card;

        const baseHealth = await getDifficultyFromGemini(Question);
        const baseDamage = calculateBaseDamage();
        const cardId = uuidv4();

        const cardObject = {
            id: cardId,
            question: Question,
            answer: Answer,
            base_health: baseHealth,
            base_dmg: baseDamage,
        };

        deck.push(cardObject);

        // Store in Firestore
        await db.collection('flashcards').doc(cardId).set(cardObject);
    }
    // Print the JSON deck
    console.log(JSON.stringify(deck, null, 2));
    return deck;
}

