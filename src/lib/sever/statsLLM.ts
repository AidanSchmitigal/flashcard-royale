import axios from 'axios';
import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { GEMINI_API_KEY } from '$env/static/private';
import fs from 'fs';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
}
const db = admin.firestore();

// Function to calculate base damage
function calculateBaseDamage(): number {
    return Math.floor(Math.random() * 10) + 2; // Random number between 2 and 11 for base_dmg
}

// Function to calculate base health based on content complexity
function calculateBaseHealth(term: string, definition: string): number {
    // Simple algorithm: longer content = more difficult = more health
    const contentLength = term.length + definition.length;
    
    // Scale from 1-10 based on content length
    let difficulty = Math.min(10, Math.max(1, Math.floor(contentLength / 20)));
    
    // Add some randomness (±1)
    difficulty += Math.floor(Math.random() * 3) - 1;
    
    // Ensure within 1-10 range
    difficulty = Math.min(10, Math.max(1, difficulty));
    
    // Multiply by 5 to get health points (5-50)
    return difficulty * 5;
}

// Fixed function to get difficulty from Gemini (with fallback)
async function getDifficultyFromGemini(term: string, definition: string): Promise<number> {
    try {
        console.log(`Attempting Gemini API call for: "${term}"`);
        
        // Updated API endpoint (check latest Gemini API docs)
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `Rate this flashcard's difficulty from 1-10 (1=easy, 10=hard). Reply ONLY with a number.
                                Term: "${term}"
                                Definition: "${definition}"`
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 5
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        console.log("API response received:", JSON.stringify(response.data, null, 2));
        
        // Extract the text content
        const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        console.log('Raw response text:', responseText);

        // Extract a number from 1-10
        const match = responseText.match(/\b([1-9]|10)\b/);
        if (match) {
            const parsed = parseInt(match[0]);
            console.log(`Difficulty extracted: ${parsed}`);
            return parsed;
        }
        
        // If no valid number found, use fallback
        console.log("No valid difficulty found in response, using fallback");
        return calculateBaseHealth(term, definition) / 5;
    } catch (err) {
        console.error('Error with Gemini API:', err.message);
        console.log("Using local difficulty calculation instead");
        return calculateBaseHealth(term, definition) / 5;
    }
}

// Function to process a full deck of flashcards
export async function processFlashcards(inputJson: { term: string; definition: string }[]) {
    const deck: any[] = [];

    for (const card of inputJson) {
        const { term, definition } = card;
        
        // First try Gemini API, fallback to local calculation if needed
        let difficultyValue;
        try {
            difficultyValue = await getDifficultyFromGemini(term, definition);
        } catch (e) {
            console.log("Falling back to local calculation");
            difficultyValue = calculateBaseHealth(term, definition) / 5;
        }
        
        const baseHealth = difficultyValue * 5; // Convert 1-10 to 5-50
        const baseDamage = calculateBaseDamage();
        const cardId = uuidv4();

        const cardObject = {
            id: cardId,
            term,
            definition,
            base_health: baseHealth,
            base_dmg: baseDamage,
        };

        deck.push(cardObject);
        console.log(`Processed card: ${term}, Health: ${baseHealth}, Damage: ${baseDamage}`);
    }
    
    return deck;
}

// Original function kept for backward compatibility
async function processOriginalFlashcards(inputJson: { Question: string; Answer: string }[]) {
    const deck: any[] = [];

    for (const card of inputJson) {
        const { Question, Answer } = card;

        const baseHealth = calculateBaseDamage();
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

