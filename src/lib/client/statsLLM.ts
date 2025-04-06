import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Gemini API Key
const GEMINI_API_KEY = 'AIzaSyCIgomPMh9mI1CxfknDweyLykZM8db_6vQ';

// Function to calculate base damage
function calculateBaseDamage(): number {
    return Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10 for base_dmg
}

// Function to get difficulty from Gemini
export async function getDifficultyFromGemini(question: string): Promise<number> {
	try {
		const response = await axios.post(
			`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
			{
				contents: [
					{
						role: "user",
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
		return Math.min(Math.max(parsed, 1), 10);
	} catch (err) {
		console.error('Error fetching difficulty from Gemini:', err);
		return 1;
	}
}


// Function to process a full deck of flashcards
export async function processFlashcards(inputJson: QuizCard[]): Promise<Card[]> {
    const cards: Card[] = [];

    for (const card of inputJson) {
        const baseHealth = await getDifficultyFromGemini(card.question);
        const baseDamage = calculateBaseDamage();

        const cardObject: Card = {
            question: card.question,
            answer: card.answer,
            baseHealth: baseHealth,
            baseDamage: baseDamage,
        };

        cards.push(cardObject);
    }

    return cards;
}

